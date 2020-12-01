import React, { useMemo, useState, Fragment, useContext, useEffect, useCallback } from 'react'
import DynamicEngine, { componentsType } from '@/components/DynamicEngine/index'
import TargetBox from '../TargetBox/index'
import {
  Tabs
} from 'antd'
import classnames from 'classnames'
import { dooringContext } from '@/layout';


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

import templateH5 from '@/components/BasicShop/BasicComponents/template'
import schemaH5 from '@/components/BasicShop/schema'
import Calibration from '@/components/Calibration/index'
import SourceBox from '../SourceBox/index'

const { TabPane } = Tabs

const ContainerComponent = (props: {
  history?: any;
  location?: any;
  pstate?: any;
  cstate?: any;
  dispatch?: any;
}) => {

  const [scaleNum, setScale] = useState(1);

  useEffect(() => {
    console.log(schemaH5, '___')
  })
  const context = useContext(dooringContext)

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

  const template = useMemo(() => {
    if (context.theme === 'h5') {
      return templateH5
    }
  }, [context.theme])


  // const generateHeader = useMemo(() => {
  //   return (type: componentsType, text: string = '') => {
  //     return (
  //       <div>
  //         {CpIcon[type]} {text}
  //       </div>
  //     )
  //   }
  // }, [CpIcon])

  const generateHeader = useCallback((type: componentsType, text: string = '') => {
    return (
      <div>
        {CpIcon[type]} {text}
      </div>
    )
  }, [CpIcon])

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
        <>
          <TabPane tab={generateHeader('base')} key='1'>
            <span className={styles.ctitle}>基础组件</span>

            <div className={styles.flexBox}>
              {template.map((val, i) => {
                return (
                  <TargetBox item={val} key={i}>
                    <DynamicEngine {...val} config={schemaH5[val.type].config} isTpl={true} componentsType='base' />
                  </TargetBox>
                )
              })}
            </div>

          </TabPane>
          <TabPane tab={generateHeader('media')} key='2'>
            <span className={styles.ctitle}>视频组件</span>
          </TabPane>

          <TabPane tab={generateHeader('visible')} key='3'>
            <span className={styles.ctitle}>可视化组件</span>
          </TabPane>
        </>
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

        <div className={styles.tickMark}>
          <div className={styles.tickMarkTop}>
            <Calibration direction='up' id="calibrationUp" multiple={scaleNum} />
          </div>
          <div className={styles.tickMarkLeft}>
            <Calibration direction='right' id="calibrationRight" multiple={scaleNum} />
          </div>
          <SourceBox />
        </div>
      </div>
    </div>
  )
}

export default ContainerComponent