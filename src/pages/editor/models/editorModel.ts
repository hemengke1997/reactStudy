/*
 * @Author: hemengke
 * @Date: 2020-12-01 17:50:26
 * @LastEditTime: 2020-12-04 15:18:18
 * @LastEditors: hemengke
 * @Description: 根据umijs规则， src下的子目录下的models文件夹中的文件为dva的models文件，不需要手动注册
 */

import { uuid } from '@/utils/tool';
import { plugin } from 'umi';
const pointData = localStorage.getItem('userData') || '[]';

function overSave(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}

export interface IPointData {
  id: string;
  item: any;
  point: any;
  isMenu?: any;
}

export default {
  namespace: 'editorModel', // 必需
  state: {
    pointData: JSON.parse(pointData),
    curPoint: null,
  },
  reducers: {
    addPointData(state: any, { payload }: any) {
      let pointData = [...state.pointData, payload];
      overSave('userData', pointData);
      return {
        ...state,
        pointData,
        curPoint: payload,
      };
    },
    modifyPointData(state: any, { payload }: IPointData) {
      const { id } = payload;
      const pointData = state.pointData.map(item => {
        if (item.id === id) {
          return payload;
        }
        return item;
      });
      overSave('userData', pointData);
      return {
        ...state,
        pointData,
        curPoint: payload,
      };
    },
    copyPointData(state: any, { payload }) {
      const { id } = payload;
      const tempPointData = [...state.pointData];
      const temp = tempPointData.find(item => item.id === id);
      if (temp) {
        tempPointData.push({ ...temp, id: uuid(6, 10) });
      }
      overSave('userData', pointData);
      return {
        ...state,
        pointData: tempPointData,
      };
    },
    removePointData(state: any, { payload }) {
      const { id } = payload;
      const tempPointData = state.pointData.filter(item => item.id !== id);
      overSave('userData', pointData);
      return {
        ...state,
        pointData: tempPointData,
      };
    },
  },
  effects: {},
  subscriptions: {},
};
