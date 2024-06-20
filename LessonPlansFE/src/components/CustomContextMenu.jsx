/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import './CustomContextMenu.css'

const CustomContextMenu = ({ options, onOptionSelect, position }) => {
  const [visible, setVisible] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    const handleClick = () => setVisible(false)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])
  
  useEffect(() => {
    if (position) {
      setVisible(true)
      adjustPosition(position)
    }
  }, [position])

  const adjustPosition = (position) => {
    const { innerWidth, innerHeight } = window
    const { scrollX, scrollY } = window
    const menuHeight = 200
    const menuWidth = 150

    let adjustedX = position.x
    let adjustedY = position.y
    
    if (position.x + menuWidth > innerWidth) {
      adjustedX = innerWidth - menuWidth - 10 + scrollX
    }

    if (position.y + menuHeight > innerHeight) {
      adjustedY = innerHeight - menuHeight - 10 + scrollY
    } else {
      adjustedY = position.y + scrollY
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
    console.log('position.y, innerHeight, menuHeight, scrollY, adjustedY', 
      [position.y, innerHeight, menuHeight, scrollY, adjustedY])
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {visible && adjustedPosition && (
        <ul className="custom-context-menu" style={{ top: adjustedPosition.y, left: adjustedPosition.x }}>
          {options.map((option, index) => (
            <li key={index} onClick={() => onOptionSelect(option)}>
              {option.icon && <span className='menu-icon'>{option.icon}</span>}
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomContextMenu