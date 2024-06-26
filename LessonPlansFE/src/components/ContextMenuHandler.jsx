/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import CustomContextMenu from './CustomContextMenu'
import useClickOutside from '../hooks/useClickOutside'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon, Web as WebIcon,
  OndemandVideo as OndemandVideoIcon,
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'

const ContextMenuHandler = ({ contextPosition, setContextPosition, currentLesson }) => {
  const activeSectionId = useSelector((state) => state.activeSection)
  const dispatch = useDispatch()

  const contextMenuOptions = [
    { label: 'Add Text', icon: <TextFieldsIcon /> },
    { label: 'Add Document', icon: <NoteAddIcon /> },
    { label: 'Add Website', icon: <WebIcon /> },
    { label: 'Add Video', icon: <OndemandVideoIcon /> },
    { label: 'Add Section Above', icon: <ArrowUpwardIcon /> },
    { label: 'Add Section Below', icon: <ArrowDownwardIcon /> }
  ]

  // determine the index where a new resource will be inserted
  // based on the vertical position of a right-click event
  const getResourceIndexAtPosition = (yPosition) => {
    const resourceElements = document.querySelectorAll('.resource-item')
    console.log('resourceElement', resourceElements)
    for (let i = 0; i < resourceElements.length; i++) {
      const rect = resourceElements[i].getBoundingClientRect()
      if (yPosition < rect.top + rect.height / 2) {
        console.log('i', i)
        return i
      }
    }
    return currentLesson.resources.length
  }

  const handleOptionSelect = (option) => {
    if (option.label === 'Add Section Above') {
      dispatch(setActiveForm({ type: 'Add Section', position: 'above', section: activeSectionId }))
    } else if (option.label === 'Add Section Below') { 
      dispatch(setActiveForm({ type: 'Add Section', position: 'below', section: activeSectionId }))
    } else {
      const resourceIndex = contextPosition ? getResourceIndexAtPosition(contextPosition.y) : currentLesson.resources.length
      console.log('contextPosition', contextPosition)
      dispatch(setActiveForm({ type: option.label, index: resourceIndex }))
    }
    setContextPosition(null)
  }

  const contextMenuRef = useClickOutside(() => setContextPosition(null))

  return (
    <div ref={contextMenuRef} style={{ width: '100%', height: '100%' }}>
      {contextPosition && (
        <CustomContextMenu
          options={contextMenuOptions}
          onOptionSelect={handleOptionSelect}
          position={contextPosition}
          onClose={() => setContextPosition(null)}
        />
      )}
    </div>
  )
}

export default ContextMenuHandler


/* import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import CustomContextMenu from './CustomContextMenu'
import useClickOutside from '../hooks/useClickOutside'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon, Web as WebIcon, 
  OndemandVideo as OndemandVideoIcon, 
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'

const ContextMenuHandler = ({ sectionId, sectionResources, getResourceIndexAtPosition }) => {
  const dispatch = useDispatch()
  const [contextPosition, setContextPosition] = useState(null)
  
  const contextMenuOptions = [
    { label: 'Add Text', icon: < TextFieldsIcon /> },
    { label: 'Add Document', icon: < NoteAddIcon /> },
    { label: 'Add Website', icon: < WebIcon /> },
    { label: 'Add Video', icon: < OndemandVideoIcon /> },
    { label: 'Add Section Above', icon: <ArrowUpwardIcon /> },
    { label: 'Add Section Below', icon: <ArrowDownwardIcon /> }
  ]

  const handleOptionSelect = (option) => {
    const resourceIndex = contextPosition ? getResourceIndexAtPosition(contextPosition.y) : sectionResources.length
    if (option.label === 'Add Section Above') {
      dispatch(setActiveForm({ type: 'Add Section', position: 'above', sectionId }))
    } else if (option.label === 'Add Section Below') {
      dispatch(setActiveForm({ type: 'Add Section', position: 'below', sectionId }))
    } else {
      dispatch(setActiveForm({ type: option.label, index: resourceIndex }))
    }
    setContextPosition(null)
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    console.log('Right-click detected at:', { x: event.clientX, y: event.clientY })
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  const contextMenuRef = useClickOutside(() => setContextPosition(null))
  
  return (
    <>
      <div 
        onContextMenu={handleContextMenu} 
        ref={contextMenuRef}
        style={{ width: '100%', height: '10vh', background: 'lightBlue' }}
      />  
      {contextPosition && (
        <CustomContextMenu 
          options={contextMenuOptions} 
          onOptionSelect={handleOptionSelect} 
          position={contextPosition}
          onClose={() => setContextPosition(null)}
        />
      )}
    </>
  )
}

export default ContextMenuHandler */