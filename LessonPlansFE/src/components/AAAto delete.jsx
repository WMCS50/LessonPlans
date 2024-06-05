import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { reorderResources, deleteResource } from '../features/lessons/resourcesSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import SortableItem from './SortableItem'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSaveLesson } from '../hooks/useSaveLesson'
import './LessonCreateView.css'
import CustomContextMenu from './CustomContextMenu'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon,
  Web as WebIcon, OndemandVideo as OndemandVideoIcon,
} from '@mui/icons-material'

const LessonCreateView = () => {
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonId, setLessonId] = useState(null)
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const { handleSaveLesson } = useSaveLesson()
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
    { label: 'Add Text', icon: <TextFieldsIcon /> },
    { label: 'Add Document', icon: <NoteAddIcon /> },
    { label: 'Add Website', icon: <WebIcon /> },
    { label: 'Add Video', icon: <OndemandVideoIcon /> }
  ]

  const handleOptionSelect = (option, position) => {
    const resourceIndex = position ? getResourceIndexAtPosition(position.y) : resources.length
    dispatch(setActiveForm({ type: option.label, index: resourceIndex }))
  }

  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  const getResourceIndexAtPosition = (yPosition) => {
    const resourceElements = document.querySelectorAll('.resource-item')
    for (let i = 0; i < resourceElements.length; i++) {
      const rect = resourceElements[i].getBoundingClientRect()
      if (yPosition < rect.top + rect.height / 2) {
        return i
      }
    }
    return resources.length
  }

  const handleSave = () => {
    const lesson = {
      id: lessonId,
      title: lessonTitle,
      resources: resources
    }
    handleSaveLesson(lesson)
  }

  return (
    <div className='lesson-create-view' onContextMenu={handleContextMenu}>
      <div className='toolbar'>
        <input 
          className='lesson-title-input'
          type='text'
          placeholder='Enter Lesson Title'
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <button 
          className='save-lesson-button' 
          onClick={handleSave}>Save Lesson
        </button>
        <ResponsiveAppBar setActiveForm={(form) => dispatch(setActiveForm(form))} />
        <ActiveForm />
      </div>
      
      <div className='resource-display'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={resources.map(resource => resource.id)} strategy={verticalListSortingStrategy}>
            <div className='resource-display'>
              {resources.map((resource) => (
                <SortableItem 
                  key={resource.id} 
                  id={resource.id} 
                  resource={resource} 
                  handleDeleteResource={(id) => dispatch(deleteResource(id))} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <CustomContextMenu options={contextMenuOptions} onOptionSelect={handleOptionSelect} position={contextPosition} />
      </div>
    </div>
  )
}

export default LessonCreateView