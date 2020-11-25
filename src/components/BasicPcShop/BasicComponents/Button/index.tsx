import React, { memo } from 'react'
import { Button } from 'antd'
import { IButtonConfig } from './schema'

const button = memo((props: IButtonConfig) => {
  const { type, text } = props
  return (
    <Button type={type}>{text}</Button>
  )
})