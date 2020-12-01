import React, { memo } from 'react'
import { IHeaderConfig } from './schema'
import logos from '@/assets/04-页头.png'
import styles from './index.less'


const Header = memo((props: IHeaderConfig) => {
  const { bgColor, logo, logoText, fontSize, color } = props
  return (
    <>
      {
        props.isTpl && (
          <div>
            <img src={logos} alt="" />
          </div>
        )
      }
      {
        !props.isTpl && (
          <header className={styles.header}
            style={{
              backgroundColor: bgColor,
              overflow: 'hidden',
              position: 'absolute',
              width: `${props.baseWidth}%`,
              height: `${props.baseHeight}%`,
              borderRadius: props.baseRadius,
              transform: `translate(${props.baseLeft}, ${props.baseTop}) scale(${props.baseScale}) rotate(${props.baseRotate})`
            }}
          >
            <div className={styles.logo}>
              <img src={logo && logo[0].url} alt={logoText} />
            </div>
            <div className={styles.logoText} style={{ fontSize, color }}>
              {logoText}
            </div>
          </header>
        )
      }
    </>
  )
})

export default Header