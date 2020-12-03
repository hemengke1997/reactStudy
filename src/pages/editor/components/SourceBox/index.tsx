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
import GridLayout, { ItemCallback } from 'react-grid-layout';
import { Dispatch } from 'umi';
import { dooringContext } from '@/layout';
import { connect } from 'dva';
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
} from 'react-contexify';
import { createPortal } from 'react-dom';
import { uuid } from '@/utils/tool';

export interface SoureBoxProps {
  pstate: {
    pointData: { id: string; item: any; point: any; isMenu?: any }[];
    curPoint: any;
  };
  cstate: { pointData: { id: string; item: any; point: any }[]; curPoint: any };
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
    cstate,
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
  const cpointData = cstate ? cstate.pointData : [];

  const { show } = useContextMenu({
    id: MENU_ID,
  });

  const handleContextMenu = useCallback((e: Event) => {
    // put whatever custom logic you need
    // you can even decide to not display the Menu
    show(e);
  }, []);

  const handleItemClick = useCallback(() => {
    console.log('click');
  }, []);

  const [collectedProps, drop] = useDrop({
    accept: allType || ['Header', 'Footer'],
    drop: (item: { h: number; type: string; x?: number }, monitor) => {
      let parentDiv = document.querySelector(`#${canvasId}`);
      let pointRect = parentDiv.getBoundingClientRect();
      let top = pointRect.top;
      let pointEnd = monitor.getSourceClientOffset();
      let y = pointEnd.y < top ? 0 : pointEnd.y - top;
      let col = 24; // 网格列数
      let cellHeight = 2;
      let w = item.type === 'Icon' ? 3 : col;

      //转换成网格规则的坐标和大小
      if (context.theme === 'h5') {
        dispatch({
          type: 'editorModel/addPointData',
          payload: {
            id: uuid(6, 10),
            item,
            point: {},
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
        <Item onClick={handleItemClick}>
          <span>复制</span>
        </Item>
        <Separator />
        <Item onClick={handleItemClick}>
          <span>删除</span>
        </Item>
      </Menu>
    );
  }, [handleItemClick]);

  const opacity = collectedProps.isOver ? 0.7 : 1;

  const portal = useMemo(() => {
    return createPortal(menu, document.body);
  }, [menu]);

  useEffect(() => {
    if (collectedProps.canDrop && !collectedProps.isOver) {
      setIsDropping(true);
    } else {
      setIsDropping(false);
    }
  }, [collectedProps.canDrop, collectedProps.isOver]);

  const onDragStop: ItemCallback = useCallback(() => {}, []);
  const onDragStart: ItemCallback = useCallback(() => {});

  const onResizeStop: ItemCallback = useCallback(() => {});
  // 放组件的盒子
  const render = useMemo(() => {
    return (
      <Draggable position={dragState} disabled={true}>
        <div className={styles.canvasBox} onContextMenu={handleContextMenu}>
          <div
            id={canvasId}
            className={`${styles.canvas} ${isDropping && styles.highlight}`}
            style={{ transform: `scale(${scaleNum})`, opacity }}
            ref={drop}
          >
            {/* {
                pointData.length === 0 ? (
                  <GridLayout
                    className={styles.gridLayout}
                    cols={24}
                    rowHeight={2}
                    width={375}
                    margin={[0, 0]}
                    onDragStop={onDragStop}
                    onDragStart={onDragStart}
                    onResizeStop={onResizeStop}>

                  </GridLayout>
                ) : null
              } */}
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
