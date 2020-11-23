/*
 * @Author: hemengke
 * @Date: 2020-11-23 14:16:15
 * @LastEditTime: 2020-11-23 14:26:22
 * @LastEditors: hemengke
 * @Description: 获取/设置 session
 */


type sesstionType = {
  key: string,
  value: any
}

export const setSessionStorage = (sesstionItem: sesstionType) => {
  return new Promise((resolve) => {
    window.sessionStorage.setItem(sesstionItem)
    resolve(true)
  })

}

export const getSessionStorage = (key: string) => {
  return new Promise((resolve, reject) => {
    const val = window.sessionStorage.getItem(key)
    if (val && val !== null) {
      resolve(val)
    } else {
      resolve(null)
    }
  })
}