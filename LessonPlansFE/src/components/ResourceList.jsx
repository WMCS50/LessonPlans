/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import SortableResource from './SortableResource'
import CustomContextMenu from './CustomContextMenu'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { reorderResources, deleteResource } from '../features/lessons/resourcesSlice'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon,
  Web as WebIcon, OndemandVideo as OndemandVideoIcon,
} from '@mui/icons-material'

const ResourceList = () => {
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const [contextPosition, setContextPosition] = useState(null)

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  
  const sensors = useSensors(pointerSensor)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      dispatch(reorderResources({ activeId: active.id, overId: over.id}))
    }
  }

  const contextMenuOptions = [
    { label: 'Add Text', icon: < TextFieldsIcon /> },
    { label: 'Add Document', icon: < NoteAddIcon /> },
    { label: 'Add Website', icon: < WebIcon /> },
    { label: 'Add Video', icon: < OndemandVideoIcon /> }
  ]

  const handleOptionSelect = (option, position) => {
    console.log('contextposition', position)
    const resourceIndex = contextPosition ? getResourceIndexAtPosition(contextPosition.y) : resources.length
    dispatch(setActiveForm({ type: option.label, index: resourceIndex }))
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
    return resources.length
  }

  return (
    <div onContextMenu={handleContextMenu}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
        <SortableContext items={resources.map(resource => resource.id)} strategy={verticalListSortingStrategy}>
          <div className='resource-display'>
            {resources.map((resource) => (
              <SortableResource 
                key={resource.id} 
                id={resource.id} 
                resource={resource} 
                handleDeleteResource={(id) => dispatch(deleteResource(id))} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <CustomContextMenu options={contextMenuOptions} onOptionSelect={handleOptionSelect} position={contextPosition} />
    </div>
  )
}

export default ResourceList