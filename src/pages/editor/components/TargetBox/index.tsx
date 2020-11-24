/*
 * @Author: hemengke
 * @Date: 2020-11-24 13:38:38
 * @LastEditTime: 2020-11-24 14:03:43
 * @LastEditors: hemengke
 * @Description: 可拉拽的组件盒子 (target 目标盒子)
 */


import React, { memo, ReactNode } from 'react'
import styles from './index.less'

type TargetBoxProps = {
  item: any,
  children: ReactNode,
  canvasId: string
}

const TargetBox = memo((props: TargetBoxProps) => {
  
  return (
    <div className={styles.targetBox}>
      <div className={styles.module}>
        <div className={styles.moduleGraph}>
          {props.children}
        </div>
        <div className={styles.moduleName}>
          {props.item.displayName}
        </div>
      </div>
    </div>
  )
})

export default TargetBox

