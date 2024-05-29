/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import './CustomContextMenu.css'

const CustomContextMenu = ({ options, onOptionSelect, children, position }) => {
  const [visible, setVisible] = useState(false)
  const [adjustedPosition, setAdjustedPosition] = useState(position)

  useEffect(() => {
    const handleClick = () => setVisible(false)
    window.addEventListener('click', handleClick)
    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  console.log('position', position)
  console.log('adjustedPosition', adjustedPosition)
  
  useEffect(() => {
    if (position) {
      setVisible(true)
      adjustPosition(position)
    }
  }, [position])

  const adjustPosition = (position) => {
    const { innerWidth, innerHeight } = window
    console.log('innerWidth/Height', {innerWidth, innerHeight})
    const menuHeight = 100
    const menuWidth = 150

    let adjustedX = position.x
    let adjustedY = position.y
    
    if (position.x + menuWidth > innerWidth) {
      adjustedX = innerWidth - menuWidth - 10
    }

    if (position.y + menuHeight > innerHeight) {
      adjustedY = innerHeight  - menuHeight - 10
    }

    if (position.y - menuHeight < innerHeight) {
      adjustedY = innerHeight  - menuHeight - 10
    }


    setAdjustedPosition({ x: adjustedX, y: adjustedY })
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {children}
      {visible && adjustedPosition && (
        <ul className="custom-context-menu" style={{ top: adjustedPosition.y, left: adjustedPosition.x }}>
          {options.map((option, index) => (
            <li key={index} onClick={() => onOptionSelect(option, adjustedPosition)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default CustomContextMenu

/*
import { useState, useEffect } from 'react';
import './CustomContextMenu.css';

const CustomContextMenu = ({ options, onOptionSelect, children }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleClick = () => setVisible(false);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  const handleContextMenu = (event) => {
    event.preventDefault();
    console.log('Context menu triggered');
    setPosition({ x: event.clientX, y: event.clientY });
    setVisible(true);
  };

  return (
    <div onContextMenu={handleContextMenu} style={{ width: '100%', height: '100%' }}>
      {visible && (
        <ul className="custom-context-menu" style={{ top: position.y, left: position.x }}>
          {options.map((option, index) => (
            <li key={index} onClick={() => onOptionSelect(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
      {children}
    </div>
  );
};

export default CustomContextMenu;
*/