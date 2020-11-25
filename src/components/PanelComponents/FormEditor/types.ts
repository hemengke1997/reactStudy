/*
 * @Author: hemengke
 * @Date: 2020-11-25 16:05:46
 * @LastEditTime: 2020-11-25 18:03:01
 * @LastEditors: hemengke
 * @Description: 暂无描述
 */

// 颜色
export interface IColorConfigType {
  key: string;
  name: string;
  type: 'Color'
}

export type TColorDefaultType = string

// -----


// 数字
export interface INumberConfigType {
  key: string;
  name: string;
  type: "Number";
  range?: [number, number];
  step?: number;
}

export type TNumberDefaultType = number

// -----

// 选择
export interface ISelectConfigType<KeyType> {
  key: string;
  name: string;
  type: 'Select';
  range: Array<{ key: KeyType, text: string }>;
}

export type TSelectDefaultType<KeyType> = KeyType

// -----

// 文字
export interface ITextConfigType {
  key: string;
  name: string;
  type: 'Text'
}

export type TTextDefaultType = string

// -----

// 上传
export interface IUploadConfigType {
  key: string;
  name: string;
  type: 'Upload',
  isCrop?: boolean;
  cropRate?: number;
}

export type TUploadDefaultType = Array<{
  uid: string,
  name: string,
  status: string,
  url: string
}>

