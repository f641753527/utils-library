import React, { useState, useLayoutEffect } from 'react'
import { Button } from '.'

Button.regist()

export default () => {
  const [type, setType] = useState<"primary" | "default">('default')
  const [size, setSize] = useState<"small" | "middle" | "large">('small')

  const handleTabClick = (e: any) => {
    console.log(e.detail)
  }

  useLayoutEffect(() => {
    const btn1 = document.querySelector('web-button')
    btn1?.addEventListener('tab-click', handleTabClick)
    return () => {
      btn1?.removeEventListener('tab-click', handleTabClick)
    }
  })

  return <div>
      <p>Hello Web Components</p>
      <web-button type={type}>Web Button</web-button>
      <button onClick={() => setType('primary')}>change</button>

      <web-button type="primary" size={size}>Web Button Size</web-button>
      <button onClick={() => setSize('middle')}>middle</button>
      <button onClick={() => setSize('large')}>large</button>
    </div>
}
