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
import GridLayout from 'react-grid-layout';
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

  const opacity = false ? 0.7 : 1;

  const portal = useMemo(() => {
    return createPortal(menu, document.body);
  }, [menu]);

  // 放组件的盒子
  const render = useMemo(() => {
    return (
      <Draggable>
        <div className={styles.canvasBox} onContextMenu={handleContextMenu}>
          <div
            id={canvasId}
            className={styles.canvas}
            style={{ transform: `scale(${scaleNum})`, opacity }}
          ></div>
        </div>
      </Draggable>
    );
  }, [canvasId, dragState, scaleNum, setDragState]);

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
