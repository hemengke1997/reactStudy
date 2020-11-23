import React, { useMemo, useState, Fragment } from 'react'
import { componentsType } from 'components/DynamicEngine'
import {
  Tabs
} from 'antd'

import HeaderComponent from '../Header/index'
import styles from './index.less'

const { TabPane } = Tabs

const ContainerComponent = () => {


  const [collapsed, setCollapsed] = useState(false)

  const CpIcon = {
    base: <HighlightOutlined />,   // 基础类型
    media: <PlayCircleOutlined />, // 视频
    visible: <PieChartOutlined />, // 可视化
  };

  const generateHeader = useMemo(() => {
    return (type: componentsType, text: string) => {
      return (
        <div>
          {CpIcon[type]} {text}
        </div>
      )
    }
  }, [CpIcon])  // ？

  const tabsRender = useMemo(() => {
    if (collapsed) {
      return (
        <Fragment>
          <TabPane tab={generateHeader('base', '')} key='1'></TabPane>
          <TabPane tab={generateHeader('media', '')} key='2'></TabPane>
          <TabPane tab={generateHeader('visible', '')} key='3'></TabPane>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <TabPane tab={generateHeader('base','')} key='1'>
            <span className={styles.ctitle}>基础组件</span>
            
          </TabPane>
        </Fragment>
      )
    }
  }, [])
  return (
    <div className={styles.containerWrapper}>
      <HeaderComponent />


      <div className={styles.container}>
        {/* 左侧 */}
        <div className={styles.leftArea}>

          <div className={styles.componentList}>
            <Tabs tabPosition="left">
              {tabsRender}
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