/*
 * @Author: hemengke
 * @Date: 2020-11-23 09:48:46
 * @LastEditTime: 2020-11-23 20:31:13
 * @LastEditors: hemengke
 * @Description: 暂无描述
 */
import { defineConfig } from 'umi';
import path from 'path'


export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // 按需加载
  dynamicImport: {

  },
  // 在umirc文件中通过key来配置插件
  antd: {},
  dva: {},
  routes: [
    {
      exact: false,
      path: '/',
      component: '@/layout/index.tsx',
      routes: [
        {
          path: '/',
          component: '@/pages/home/index.tsx'
        },
        {
          path: '/editor',
          component: '@/pages/editor/index'
        },
        {
          path: '/ide',
          component: '@/pages/ide/index'
        }
      ]
    },
  ],
  base: '/',
  hash: false,
  title: '贺梦柯',
  history: {
    type: 'browser'
  },
  favicon: '/public/favicon.svg',
  alias: {
    utils: path.resolve(__dirname, 'src/utils'),
    assets: path.resolve(__dirname, 'src/assets')
  },
  theme: {
    "primary-color": "#2F54EB"
  },
});
