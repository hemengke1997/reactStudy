import React from 'react'

// react-dnd
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import ContainerComponent from './components/Container/index'
import styles from './index.less'

const Editor = (props) => {
  return (
    <div className={styles.layout}>
      <DndProvider backend={HTML5Backend}>
        <ContainerComponent {...props} />
      </DndProvider>
    </div>
  )
}

export default React.memo(Editor)