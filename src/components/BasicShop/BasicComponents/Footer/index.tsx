import React, { memo } from 'react'

import { IFooterConfig } from './schema'
import styles from './index.less'
import logos from '@/assets/02-页脚.png'

const Footer = (props: IFooterConfig) => {
  const { isTpl, logo, logoText } = props
  return (
    <>
      {
        isTpl && (
          <div>
            <img src={logos} alt="" />
          </div>
        )
      }
      {
        !isTpl && (
          <footer className={styles.footer}>
            <div className={styles.logo}>
              <img src={logo && logo[0].url} alt={logoText} />
            </div>
            <div className={styles.logoText}>{logoText}</div>
          </footer>
        )
      }
    </>
  )
}

export default memo(Footer)