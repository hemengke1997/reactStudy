/*
 * @Author: hemengke
 * @Date: 2020-11-23 15:27:09
 * @LastEditTime: 2020-11-23 16:15:38
 * @LastEditors: hemengke
 * @Description: 头部
 */


import React from 'react'
import {
  ArrowLeftOutlined,
  MobileOutlined,
  DownloadOutlined,
  CopyOutlined,
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  FileAddOutlined,
  CodeOutlined,
  SketchOutlined,
  UploadOutlined,
  InstagramOutlined,
} from '@ant-design/icons';
import { Button, Upload, Tooltip, Popover } from 'antd'

import styles from './index.less'

interface IHeaderComponentProps {

}

const HeaderComponent = (props: IHeaderComponentProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.logoArea}>
        <ArrowLeftOutlined className={styles.backArrow} />
        <div className={styles.logo}></div>
      </div>
      <div className={styles.functionArea}>
        <Button type="primary">模板库</Button>
        <Button type="link">保存模板</Button>

        <Tooltip title="上传模板">
          <Upload>
            <Button type="link">
              <UploadOutlined />
            </Button>
          </Upload>
        </Tooltip>

        <Tooltip title="下载json文件">
          <Button type="link" >
            <DownloadOutlined />
          </Button>
        </Tooltip>

        <Tooltip title="新建页面">
          <Button type="link">
            <FileAddOutlined />
          </Button>
        </Tooltip>

        <Tooltip title="扫二维码预览">
          <Popover>
            <Button type="link">
              <MobileOutlined />
            </Button>
          </Popover>
        </Tooltip>

        <Tooltip title="清空画布">
          <Button type="link">
            <DeleteOutlined />
          </Button>
        </Tooltip>

        <Tooltip title="撤销">
          <Button type="link">
            <UndoOutlined />
          </Button>
        </Tooltip>

        <Tooltip title="重做">
          <Button type="link">
            <RedoOutlined />
          </Button>
        </Tooltip>

        <Tooltip title="一键生成海报分享图">
          <Button type="link">
            <InstagramOutlined />
          </Button>
        </Tooltip>

        <Button type="link">预览</Button>

        <Button type="link">帮助</Button>
      </div>
      <div className={styles.btnAreas}>
        <Button type="primary" className={styles.codeBtn}>
          <CodeOutlined />在线编程
        </Button>

        <Button type="primary">
          <SketchOutlined />会员登录
        </Button>
      </div>

    </div>
  )
}

export default React.memo(HeaderComponent)
