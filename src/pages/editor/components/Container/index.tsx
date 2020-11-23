import React from 'react'

import {
  Tabs
} from 'antd'

import HeaderComponent from '../Header/index'
import styles from './index.less'

const { TabPane } = Tabs

const ContainerComponent = () => {
  return (
    <div className={styles.containerWrapper}>
      <HeaderComponent />


      <div className={styles.container}>
        {/* 左侧 */}
        <div className={styles.leftArea}>

          <div className={styles.componentList}>
            <Tabs tabPosition="left">

            </Tabs>
          </div>
          
          <div className={styles.collapsed}>

          </div>
        </div>
        {/* 右侧 */}
        <div className={styles.rightArea}></div>
      </div>
    </div>
  )
}

export default ContainerComponent