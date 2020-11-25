import {
  IColorConfigType,
  INumberConfigType,
  ISelectConfigType,
  ITextConfigType,
  TColorDefaultType,
  TNumberDefaultType,
  TSelectDefaultType,
  TTextDefaultType,
} from '@/components/PanelComponents/FormEditor/types';

export type TButtonSelectKeyType = 'left' | 'center' | 'right'

export interface IButtonConfig {
  bgColor: TColorDefaultType;
  color: TColorDefaultType;
  align: TSelectDefaultType<TButtonSelectKeyType>;
  fontSize: TNumberDefaultType;
  height: TNumberDefaultType;
  text: TTextDefaultType;
  type: any;
}

export type TButtonEditData = Array<IColorConfigType | INumberConfigType | ITextConfigType | ISelectConfigType<TButtonSelectKeyType>>

export interface IButtonSchema {
  editData: TButtonEditData;
  config: IButtonConfig
}

const Button: IButtonSchema = {
  editData: [
    {
      key: 'bgColor',
      name: '背景色',
      type: 'Color'
    },
    {
      key: 'height',
      name: '高度',
      type: 'Number'
    },
    {
      key: 'color',
      name: '文字颜色',
      type: 'Color'
    },
    {
      key: 'text',
      name: '文字',
      type: 'Text'
    },
    {
      key: 'align',
      name: '文字对齐方式',
      type: 'Select',
      range: [
        {
          key: 'left',
          text: '左对齐'
        },
        {
          key: 'center',
          text: '居中对齐'
        },
        {
          text: 'right',
          text: '右对齐'
        }
      ]
    },
    {
      key: 'fontSize',
      name: '高度',
      type: 'Number'
    }
  ],
  config: {
    bgColor: 'rgba(0,0,0,1)',
    color: 'rgba(255,255,255,1)',
    align: 'center',
    fontSize: 16,
    height: 48,
    text: '按钮 button 按钮 button',
    type: 'primary'
  }
}

export default Button