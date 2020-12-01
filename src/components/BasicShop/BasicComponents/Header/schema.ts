/*
 * @Author: hemengke
 * @Date: 2020-11-25 17:23:39
 * @LastEditTime: 2020-11-30 11:17:27
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

export type THeaderEditData = Array<
  IColorConfigType | INumberConfigType | IUploadConfigType | ITextConfigType
>

export interface IHeaderConfig extends ICommonBaseType {
  bgColor: TColorDefaultType; // string
  logo: TUploadDefaultType;
  logoText: TTextDefaultType;
  fontSize: TNumberDefaultType;
  color: TColorDefaultType;
  height: TNumberDefaultType;
}

export interface IHeaderSchema {
  editData: THeaderEditData;
  config: IHeaderConfig
}

const Header: IHeaderSchema = {
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
      type: 'Upload',
      isCrop: true,
      cropRate: 1000 / 618
    },
    {
      key: 'logoText',
      name: 'logo文字'
    },
    {
      key: 'fontSize',
      name: '字体大小'
    },
    {
      key: 'color',
      name: '颜色'
    },
    {
      key: 'height',
      name: '高度'
    }
  ],
  config: {
    ...baseDefault,
    bgColor: '#000',
    logo: [{
      uid: '001',
      name: 'image.png',
      status: 'done',
      url: require('../../../../../public/favicon.svg'),
    }],
    logoText: '页头 Header',
    fontSize: 20,
    color: 'red',
    height: 50
  }
}

export default Header


