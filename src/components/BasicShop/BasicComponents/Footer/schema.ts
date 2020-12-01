/*
 * @Author: hemengke
 * @Date: 2020-11-30 11:35:54
 * @LastEditTime: 2020-11-30 14:21:46
 * @LastEditors: hemengke
 * @Description: 暂无描述
 */


import {
  IColorConfigType,
  INumberConfigType,
  ITextConfigType,
  IUploadConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  TTextDefaultType,
  TUploadDefaultType,
} from '@/components/PanelComponents/FormEditor/types'

import { ICommonBaseType, baseSchema, baseDefault } from '../../common'

export type TFooterEditData = Array<IColorConfigType | INumberConfigType | IUploadConfigType | ITextConfigType>

export interface IFooterConfig extends ICommonBaseType {
  bgColor: TColorDefaultType;
  logo: TUploadDefaultType;
  logoText: TTextDefaultType;
  fontSize: TNumberDefaultType;
  color: TColorDefaultType;
  height: TNumberDefaultType
}

export interface IFooterSchema {
  editData: TFooterEditData;
  config: IFooterConfig
}

const Footer: IFooterSchema = {
  editData: [
    ...baseSchema,
    {
      key: 'bgColor',
      name: '背景色',
      type: 'Color'
    },
    {
      key: 'logo',
      name: 'logo图标',
      type: 'Upload'
    },
    {
      key: 'logoText',
      name: 'logo文本',
      type: 'Text'
    },
    {
      key: 'fontSize',
      name: '字体大小',
      type: 'Number'
    },
    {
      key: 'color',
      name: '文本颜色',
      type: 'Color'
    },
    {
      key: 'height',
      name: '高度',
      type: 'Number'
    }
  ],
  config: {
    ...baseDefault,
  }
}

export default Footer