import React from 'react'

import HeaderComponent from './components/Header/index'

const Editor = () => {

  return (
    <div>
      <HeaderComponent />
    </div>
  )
}

export default React.memo(Editor)