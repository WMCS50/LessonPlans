import { useEffect, useState, useRef } from 'react'
import './CustomContextMenu.css'

const CustomContextMenu = ({ options, onOptionSelect, position }) => {
  const [visible, setVisible] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)
  const contextMenuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setVisible(false)
      }
    }

    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (position) {
      setVisible(true)
      adjustPosition(position)
    }
  }, [position])

  const adjustPosition = (position) => {
    const { innerWidth, innerHeight, scrollY } = window
    const menuHeight = 100
    const menuWidth = 150

    let adjustedX = position.x
    let adjustedY = position.y + scrollY

    if (position.x + menuWidth > innerWidth) {
      adjustedX = innerWidth - menuWidth - 100
    }

    if (position.y + menuHeight > innerHeight) {
      adjustedY = innerHeight - menuHeight - 10 + scrollY
    } else {
      adjustedY = position.y + scrollY
    }

    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }

  useEffect(() => {
    console.log('contextposition from CCM', adjustedPosition)
  }, [adjustedPosition])

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {visible && adjustedPosition && (
        <ul ref={contextMenuRef} className="custom-context-menu" style={{ top: adjustedPosition.y, left: adjustedPosition.x }}>
          {options.map((option, index) => (
            <li key={index} onClick={(event) => { onOptionSelect(option, event) }}>
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