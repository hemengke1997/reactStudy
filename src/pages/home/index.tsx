import React from 'react'
import { Tabs, message, Button } from 'antd'
import {
  MobileOutlined,
  ConsoleSqlOutlined,
  IdcardOutlined,
  CodeOutlined
} from '@ant-design/icons'

import { history } from 'umi'
import styles from './index.less'

const { TabPane } = Tabs;

const Home = () => {
  const handleGo = (type: string) => {
    if (type === 'H5') {
      history.push('/editor')
    } else if (type === 'PC') {
      message.error('暂未开放')
    } else {
      history.push('/ide')
    }
  }
  return (
    <div className={styles.homeContainer}>
      <div className={styles.leftArea}>
        <Tabs defaultActiveKey='1'>
          <TabPane tab={
            <span>
              <MobileOutlined />
              我的H5
            </span>
          } key="1">
            开发中...
          </TabPane>
          <TabPane tab={
            <span>
              <ConsoleSqlOutlined />
              我的大屏
            </span>
          } key="2">
            开发中...
          </TabPane>
          <TabPane tab={
            <span>
              <IdcardOutlined />
              我的可视化
            </span>
          } key="3">
            开发中...
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.rightArea}>
        <div className={styles.operation}>
          <div className={styles.card} onClick={() => handleGo('H5')}>
            <MobileOutlined />
            <div>制作H5页面</div>
          </div>
          <div className={styles.card} onClick={() => handleGo('online')}>
            <CodeOutlined />
            <div>在线编程</div>
          </div>
          <div className={styles.card} onClick={() => handleGo('PC')}>
            <ConsoleSqlOutlined />
            <div>制作可视化大屏</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// export default Home
export default React.memo(Home)