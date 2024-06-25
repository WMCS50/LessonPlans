/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import SortableResource from './SortableResource'
import DragAndDropHandler from './DragAndDropHandler'

const ResourceList = ({ sectionId }) => {
  const resources = useSelector((state) => state.resources)
  const sectionResources = resources.filter(resource => resource.sectionId === sectionId)

  return (
    <div>
      <DragAndDropHandler sectionResources={sectionResources} sectionId={sectionId}>
          <div className='resource-display'>
            {sectionResources.map((resource) => (
              <SortableResource 
                key={resource.id} 
                id={resource.id} 
                resource={resource} 
                sectionId={sectionId} 
              />
            ))}
          </div>
        </DragAndDropHandler>
    </div>
  )
}

export default ResourceList

/* 
prior to refactoring
import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { reorderResources, addResource } from '../features/lessons/resourcesSlice'
import SortableResource from './SortableResource'
import CustomContextMenu from './CustomContextMenu'
import { v4 as uuidv4 } from 'uuid'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon, Web as WebIcon, 
  OndemandVideo as OndemandVideoIcon, 
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'

const ResourceList = ({sectionId}) => {
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const sectionResources = resources.filter(resource => resource.sectionId === sectionId)
  const [contextPosition, setContextPosition] = useState(null)
  const [isAddingText, setIsAddingText] = useState(false)

  const contextMenuOptions = [
    { label: 'Add Text', icon: < TextFieldsIcon /> },
    { label: 'Add Document', icon: < NoteAddIcon /> },
    { label: 'Add Website', icon: < WebIcon /> },
    { label: 'Add Video', icon: < OndemandVideoIcon /> },
    { label: 'Add Section Above', icon: <ArrowUpwardIcon /> },
    { label: 'Add Section Below', icon: <ArrowDownwardIcon /> }
  ]

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  
  const sensors = useSensors(pointerSensor)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      dispatch(reorderResources({ activeId: active.id, overId: over.id, sectionId }))
    }
  }

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
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  //determines the index where a new resource will be inserted
  //based on the vertical position of a right-click event
  const getResourceIndexAtPosition = (yPosition) => {
    const resourceElements = document.querySelectorAll('.resource-item')
    for (let i=0; i < resourceElements.length; i++) {
      const rect = resourceElements[i].getBoundingClientRect()
      if (yPosition < rect.top + rect.height / 2) {
        return i
      }
    }
    return sectionResources.length
  }

  const useClickOutside = (handler) => {
    const ref = useRef(null)

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          handler()
        }
      }

      document.addEventListener('click', handleClickOutside)

      return () => document.removeEventListener('click', handleClickOutside)
    }, [handler, ref])

    return ref
  }

  const contextMenuRef = useClickOutside(() => setContextPosition(null))

  const handleSectionClick = () => {
    if (isAddingText) { 
      const newTextResource = {
        id: uuidv4(),
        type: 'text',
        content: '',
        sectionId
      }
      dispatch(addResource({ resource: newTextResource }))
      setIsAddingText(false)
    }
  }

  return (
    <div onContextMenu={handleContextMenu} ref={contextMenuRef} onClick={handleSectionClick}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionResources.map(resource => resource.id)} strategy={verticalListSortingStrategy}>
          <div className='resource-display'>
            {sectionResources.map((resource) => (
              <SortableResource 
                key={resource.id} 
                id={resource.id} 
                resource={resource} 
                sectionId={sectionId} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
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

export default ResourceList */