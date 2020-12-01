/*
 * @Author: hemengke
 * @Date: 2020-11-24 13:38:38
 * @LastEditTime: 2020-12-01 15:32:39
 * @LastEditors: hemengke
 * @Description: 可拉拽的组件盒子 (target 目标盒子)
 */


import React, { memo, ReactNode, useContext, useMemo } from 'react'
import { useDrag } from 'react-dnd'
import styles from './index.less'
import { dooringContext } from '@/layout'

import schemaH5 from '@/components/BasicShop/schema'

type TargetBoxProps = {
  item: any,
  children: ReactNode,
  canvasId: string
}

const TargetBox = (props: TargetBoxProps) => {

  const { item } = props
  const context = useContext(dooringContext)
  const schema = useMemo(() => {
    if (context.theme === 'h5') {
      return schemaH5
    } else {
      return '待完成'
    }
  }, [context.theme])

  const [collectedProps, drag] = useDrag({
    item: {
      type: item.type,
      config: schema[item.type as keyof typeof schema].config,
      h: item.h,
      x: item.x || 0,
      editableEl: schema[item.type as keyof typeof schema].editData,
      category: item.category
    },
    collect: monitor => {
      return {
        dragging: monitor.isDragging(),
      }
    }
  })

  const containerStyle = useMemo(() => ({
    opacity: collectedProps.dragging ? 0.4 : 1,
    cursor: 'move',
    // height: '140px'
  }), [collectedProps.dragging])

  return (
    <div className={styles.targetBox}>
      <div className={styles.module} style={{ ...containerStyle }} ref={drag}>
        <div className={styles.moduleGraph}>
          {props.children}
        </div>
        <div className={styles.moduleName}>
          {props.item.displayName}
        </div>
      </div>
    </div>
  )
}

export default memo(TargetBox)

