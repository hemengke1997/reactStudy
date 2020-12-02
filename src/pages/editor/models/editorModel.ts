/*
 * @Author: hemengke
 * @Date: 2020-12-01 17:50:26
 * @LastEditTime: 2020-12-02 15:10:28
 * @LastEditors: hemengke
 * @Description: 根据umijs规则， src下的子目录下的models文件夹中的文件为dva的models文件，不需要手动注册
 */

const pointData = localStorage.getItem('userData') || '[]';

function overSave(name: string, data: any) {
  localStorage.setItem(name, JSON.stringify(data));
}

export default {
  namespace: 'editorModel',
  state: {
    pointData: JSON.parse(pointData),
  },
  reducers: {
    addPointData(state: any, { payload }: any) {},
  },
};
