import { getSessionStorage } from './utils/sessionStorage'


let themeColor = {}
getSessionStorage('THEME').then(res=>{
  if(res === 'light') {
    themeColor = {
      '@light-color': '#fff',
      '@light-bgc': '#f0f7f9'
    }
  } else {
    themeColor = {
      '@dark-color': '#000',
      '@dark-bgc': '#000'
    }
  }
})


export default {
  "@primary-color": "#2F54EB",
  ...themeColor
}