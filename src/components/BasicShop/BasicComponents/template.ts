/*
 * @Author: hemengke
 * @Date: 2020-11-30 10:55:39
 * @LastEditTime: 2020-11-30 14:29:10
 * @LastEditors: hemengke
 * @Description: 暂无描述
 */

import Header from './Header/template'
import Footer from './Footer/template'

const basicTemplate = [
  Header,
  Footer
]

const BasicTemplate = basicTemplate.map(item => {
  return { ...item, category: 'base' }
})

export default BasicTemplate
