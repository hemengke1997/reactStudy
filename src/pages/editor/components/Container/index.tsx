import React, { useMemo, useState, Fragment } from 'react'
import DynamicEngine, { componentsType } from '@/components/DynamicEngine/index'
import TargetBox from '../TargetBox/index'
import {
  Tabs
} from 'antd'
import classnames from 'classnames'

import {
  PieChartOutlined,
  PlayCircleOutlined,
  HighlightOutlined,
  DoubleRightOutlined,
  DoubleLeftOutlined,
} from '@ant-design/icons';

import HeaderComponent from '../Header/index'
import styles from './index.less'
import './index.less'

const { TabPane } = Tabs

const ContainerComponent = () => {


  const [collapsed, setCollapsed] = useState(false)

  const CpIcon = {
    base: <HighlightOutlined />,   // 基础类型
    media: <PlayCircleOutlined />, // 视频
    visible: <PieChartOutlined />, // 可视化
  };

  const handleCollapsedChange = useMemo(() => {
    return (collapsed: boolean) => {
      setCollapsed(collapsed)
    }
  }, [])


  const generateHeader = useMemo(() => {
    return (type: componentsType, text: string = '') => {
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
          <TabPane tab={generateHeader('base')} key='1'></TabPane>
          <TabPane tab={generateHeader('media')} key='2'></TabPane>
          <TabPane tab={generateHeader('visible')} key='3'></TabPane>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <TabPane tab={generateHeader('base')} key='1'>
            <span className={styles.ctitle}>基础组件</span>
            <TargetBox item={{ displayName: 'test' }}>
              <DynamicEngine item={{ displayName: 'test' }} config={{}} componentsType='base' isTpl={true}></DynamicEngine>
            </TargetBox>
          </TabPane>
          <TabPane tab={generateHeader('media')} key='2'>
            <span className={styles.ctitle}>视频组件</span>
          </TabPane>

          <TabPane tab={generateHeader('visible')} key='3'>
            <span className={styles.ctitle}>可视化组件</span>
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
        <div className={classnames({ [styles.collapsed]: collapsed, [styles.leftArea]: true })}>

          <div className={styles.componentList}>
            <Tabs tabPosition={"left"} defaultActiveKey='1' onTabClick={() => handleCollapsedChange(false)} className="editorTabclass">
              {tabsRender}
            </Tabs>
          </div>

          <div className={styles.collapsedIcon} onClick={() => handleCollapsedChange(!collapsed)}>
            {collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
          </div>
        </div>
        {/* 右侧 */}
        <div className={styles.rightArea}></div>
      </div>
    </div>
  )
}

export default ContainerComponent