import React, {
  memo,
  useCallback,
  useContext,
  useMemo,
  ReactNode,
  useRef,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import { useDrop } from 'react-dnd';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import GridLayout, {
  ItemCallback,
  Layout,
  LayoutItem,
} from 'react-grid-layout';
import { Dispatch, connect } from 'umi';
import { dooringContext } from '@/layout';
import { StateWithHistory } from 'redux-undo';
import styles from './index.less';
import 'react-contexify/dist/ReactContexify.css';
import {
  Menu,
  Item,
  Separator,
  useContextMenu,
  theme,
  animation,
  ItemParams,
} from 'react-contexify';
import { createPortal } from 'react-dom';
import { uuid } from '@/utils/tool';
import { IPointData } from '../../models/editorModel';
import DynamicEngine from '@/core/DynamicEngine';

/*
关于GridLayout参数的介绍
cols: 一行分为 x 份
rowHeight: 高度固定值。 假设设置为 1， 那么 h: 1 就是1px  h:10 就是10px
layout可以不设置，单独设置每个子项目的data-grid
*/

export interface SoureBoxProps {
  pstate: {
    pointData: IPointData[];
    curPoint: any;
  };
  // cstate: { pointData: IPointData[]; curPoint: any };
  scaleNum: number;
  canvasId: string;
  allType: string[];
  dispatch: Dispatch;
  dragState: { x: number; y: number };
  setDragState: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>; // function useState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>];
  setIsDropping: React.Dispatch<React.SetStateAction<boolean>>;
  isDropping: boolean;
}

const MENU_ID = '😍';

const SourceBox = memo((props: SoureBoxProps) => {
  const {
    pstate,
    scaleNum,
    canvasId,
    allType,
    dispatch,
    dragState,
    setDragState,
    setIsDropping,
    isDropping,
  } = props;
  const context = useContext(dooringContext);
  const pointData = pstate ? pstate.pointData : [];

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const [canvasRect, setCanvasRect] = useState<{
    width: number;
    height: number;
  }>({ width: 0, height: 0 });

  const [activeCanvas, setActiveCanvas] = useState<{
    dom: HTMLElement;
    currentPoint: IPointData | null;
  }>({});

  const handleContextMenu = useCallback(
    (e: Event) => {
      // put whatever custom logic you need
      // you can even decide to not display the Menu
      const dataId = e.currentTarget.getAttribute('data-id');
      let currentPoint = null;
      if (dataId) {
        currentPoint = pointData.filter(item => item.id === dataId)[0];
      }
      setActiveCanvas({
        ...activeCanvas,
        dom: e.currentTarget,
        currentPoint,
      });
      e.currentTarget.classList.add(styles.active);
      show(e);
    },
    [styles.active, pointData],
  );

  useEffect(() => {
    const { dom } = activeCanvas;
    const contextmenuEvent = (e: Event) => {
      if (e.target !== dom && dom) {
        dom.classList.remove(styles.active);
      }
    };
    const clickEvent = (e: Event) => {
      if (dom) {
        dom.classList.remove(styles.active);
      }
    };

    document.addEventListener('click', clickEvent);
    document.addEventListener('contextmenu', contextmenuEvent);

    return () => {
      document.removeEventListener('click', clickEvent);
      document.removeEventListener('contextmenu', contextmenuEvent);
    };
  }, [activeCanvas.dom]);

  const handleItemClick = useCallback(
    ({ event, props, data, triggerEvent }: ItemParams<number, any>) => {
      if (event.currentTarget.id === 'copy') {
        handleContextMenuCopy();
      } else if (event.currentTarget.id === 'remove') {
        handleContextMenuRemove();
      }
    },
    [activeCanvas.currentPoint],
  );

  const handleContextMenuCopy = () => {
    if (activeCanvas.currentPoint) {
      dispatch({
        type: 'editorModel/copyPointData',
        payload: { id: activeCanvas.currentPoint.id },
      });
    }
  };

  const handleContextMenuRemove = () => {
    if (activeCanvas.currentPoint) {
      dispatch({
        type: 'editorModel/removePointData',
        payload: { id: activeCanvas.currentPoint.id },
      });
    }
  };

  const [collectedProps, drop] = useDrop({
    accept: allType,
    drop: (item: { h: number; type: string; x?: number }, monitor) => {
      let parentDiv = document.querySelector(`#${canvasId}`);
      let pointRect = parentDiv?.getBoundingClientRect();
      let top = pointRect?.top;
      // drop结束时鼠标的坐标
      let pointEnd = monitor.getSourceClientOffset();
      let y = pointEnd.y < top ? 0 : pointEnd.y - top;
      let col = 24; // 网格列数
      let cellHeight = 2;
      let w = item.type === 'Icon' ? 3 : col;

      //转换成网格规则的坐标和大小
      let gridY = Math.ceil(y / cellHeight);
      if (context.theme === 'h5') {
        dispatch({
          type: 'editorModel/addPointData',
          payload: {
            id: uuid(6, 10),
            item,
            point: {
              i: `x-${pointData.length}`,
              x: 0,
              y: gridY,
              w,
              h: item.h,
              isBounded: true,
            },
            status: 'inToCanvas',
          },
        });
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      item: monitor.getItem(),
    }),
  });

  const menu = useMemo(() => {
    return (
      <Menu id={MENU_ID} theme={theme.light} animation={animation.scale}>
        <Item id="copy" onClick={handleItemClick}>
          <span>复制</span>
        </Item>
        <Separator />
        <Item id="remove" onClick={handleItemClick}>
          <span>删除</span>
        </Item>
      </Menu>
    );
  }, [handleItemClick]);

  const opacity = collectedProps.isOver ? 0.6 : 1;

  const portal = useMemo(() => {
    return createPortal(menu, document.body);
  }, [menu]);

  // grid-layout 开始拖动
  const onDragStart: ItemCallback = useCallback(
    (
      layout: Layout,
      oldItem: LayoutItem,
      newItem: LayoutItem,
      placeholder: LayoutItem,
      e: MouseEvent,
      element: HTMLElement,
    ) => {
      const curPointData = pointData.filter(item => item.id === newItem.i)[0];
      dispatch({
        type: 'editorModel/modifyPointData',
        payload: { ...curPointData, status: 'inToCanvas' },
      });
    },
    [],
  );
  // grid-layout 停止拖动
  const onDragStop: ItemCallback = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      const curPointData = pointData.filter(item => item.id === newItem.i)[0];
      dispatch({
        type: 'editorModel/modifyPointData',
        payload: {
          ...curPointData,
          point: newItem,
          status: 'inToCanvas',
        },
      });
    },
    [],
  );
  // grid-layout 停止resize
  const onResizeStop: ItemCallback = useCallback(
    (layout, oldItem, newItem, placeholder, e, element) => {
      const curPointData = pointData.filter(item => item.id === newItem.i)[0];
      dispatch({
        type: 'editorModel/modifyPointData',
        payload: {
          ...curPointData,
          point: newItem,
          status: 'inToCanvas',
        },
      });
    },
    [],
  );

  // drag时给canvasBox添加一些动画效果
  useEffect(() => {
    if (collectedProps.canDrop && !collectedProps.isOver) {
      setIsDropping(true);
    } else {
      setIsDropping(false);
    }
  }, [collectedProps.canDrop, collectedProps.isOver]);
  // 获取canvasbox的尺寸
  useEffect(() => {
    let { width, height } = document
      .getElementById(canvasId)!
      .getBoundingClientRect();
    setCanvasRect({ width, height });
  }, [canvasId]);

  // 放组件的盒子
  const render = useMemo(() => {
    return (
      <Draggable position={dragState} disabled={true}>
        <div className={styles.canvasBox}>
          <div
            id={canvasId}
            className={`${styles.canvas} ${isDropping && styles.highlight}`}
            style={{ transform: `scale(${scaleNum})`, opacity }}
            ref={drop}
          >
            {pointData.length > 0 ? (
              <GridLayout
                className={styles.gridLayout}
                cols={24}
                rowHeight={2}
                width={canvasRect.width || 0}
                margin={[0, 0]}
                onDragStop={onDragStop}
                onDragStart={onDragStart}
                onResizeStop={onResizeStop}
              >
                {pointData.map(value => (
                  <div
                    key={value.id}
                    data-id={value.id}
                    onContextMenu={handleContextMenu}
                    data-grid={value.point}
                    className={styles.dragItem}
                  >
                    <DynamicEngine {...value.item} />
                  </div>
                ))}
              </GridLayout>
            ) : null}
          </div>
        </div>
      </Draggable>
    );
  }, [
    canvasId,
    dragState,
    scaleNum,
    setDragState,
    isDropping,
    handleContextMenu,
    pointData,
    onDragStart,
    onDragStop,
    onResizeStop,
    opacity,
    canvasRect.width,
  ]);

  return (
    <>
      {render}
      {portal}
    </>
  );
});

export default connect((state: StateWithHistory<any>) => ({
  pstate: state.present.editorModel,
  // cstate: state.present.editorPcModel
}))(SourceBox);
