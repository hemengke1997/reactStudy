import React, { memo, useContext } from 'react'
import { useDrop } from 'react-dnd'
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable'
import GridLayout from 'react-grid-layout';
import { Dispatch } from 'umi'
import { dooringContext } from '@/layout'
import { connect } from 'dva'


export interface SoureBoxProps {
  pstate: { pointData: { id: string; item: any; point: any; isMenu?: any }[]; curPoint: any };
  cstate: { pointData: { id: string; item: any; point: any }[]; curPoint: any };
  scaleNum: number;
  canvasId: string;
  allType: string[];
  dispatch: Dispatch;
  dragState: { x: number; y: number };
  setDragState: React.Dispatch<React.SetStateAction<{ x: number; y: number; }>>
}

const SourceBox = (props: SoureBoxProps) => {
  const { pstate, cstate, scaleNum, canvasId, allType, dispatch, dragState, setDragState } = props
  const context = useContext(dooringContext)
  const pointData = pstate ? pstate.pointData : []
  const cpointData = cstate ? cstate.pointData : []

  return (
    <>
    </>
  )

}


export default memo(SourceBox)