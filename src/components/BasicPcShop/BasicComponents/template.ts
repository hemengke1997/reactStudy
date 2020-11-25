/*
 * @Author: hemengke
 * @Date: 2020-11-23 21:01:21
 * @LastEditTime: 2020-11-25 16:46:01
 * @LastEditors: hemengke
 * @Description: 
 */

import Button from './Button/template'

const basicTemplate = [Button]

const BasicTemplate = basicTemplate.map(item => {
  return { ...item, category: 'base' }
})

export default BasicTemplate