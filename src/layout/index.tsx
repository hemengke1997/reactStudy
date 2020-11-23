import React, { createContext, useState } from 'react'

import { IRouteComponentProps } from 'umi'


export type dooringContextType = 'h5' | 'pc'

export interface IdooringContextType {
  theme: dooringContextType,
  setTheme: Function
}

export const dooringContext = createContext<IdooringContextType>({
  theme: 'h5',
  setTheme: () => { }
})

export default function Layout({ children }: IRouteComponentProps) {
  const [theme, setTheme] = useState<dooringContextType>('h5')
  return (
    <dooringContext.Provider value={{
      theme,
      setTheme
    }}>
      {children}
    </dooringContext.Provider>
  )
}