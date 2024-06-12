import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { reorderResources, deleteResource, resetResources, updateResources } from '../features/lessons/resourcesSlice'
import axios from 'axios'
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
//placeholder logo
import SchoolIcon from '@mui/icons-material/School'
import { green } from '@mui/material/colors'
import UserMenu from './UserMenu'

const LessonCreateView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const { handleSaveLesson } = useSaveLesson()
  const [contextPosition, setContextPosition] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      resources: []
    })
  
  useEffect(() => {
    dispatch(resetResources())
  }, [dispatch])

//Fetches existing lesson data if navigated to from read view.
  useEffect(() => {
    if (id) {
      const fetchLesson = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/lessons/${id}`)
          const lessonData = response.data
          setCurrentLesson (lessonData)
          dispatch(updateResources(lessonData.resources))
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
      fetchLesson()
    }
  }, [id, dispatch])

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
    const resourceIndex = contextPosition ? getResourceIndexAtPosition(position.y) : resources.length
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

  //constructs a lesson object then calls handleSaveLesson
  const handleSave = async () => {
    const lesson = {
      ...currentLesson,
      resources: resources
    }
   
    const result = await handleSaveLesson(lesson)
    if (result && !currentLesson.id) {
      setCurrentLesson({ ...lesson, id: result.id })
    }
  }

  return (
    <div className='lesson-create-view' onContextMenu={handleContextMenu}>
      <div className='above-app-bar'>
        <SchoolIcon sx={{ width: 50, height: 50, color: green[900], marginRight: 5 }} />
        <input 
          className='lesson-title-input'
          type='text'
          placeholder='Enter Lesson Title'
          value={currentLesson.title}
          onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value})}
        />
        <button 
          className='save-lesson-button' 
          onClick={() => handleSave()}>Save
        </button>
        <UserMenu className='user-menu'/>
      </div>
      <div className='app-bar'>
        <ResponsiveAppBar className='responsive-app-bar'
          setActiveForm={(form) => dispatch(setActiveForm(form))}
          resourcesLength={resources.length} />
        <ActiveForm />
      </div>
      
      <div >
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

/* eslint-disable react/prop-types */
/*import { useState } from 'react'
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
    { label: 'Add Text', icon: < TextFieldsIcon /> },
    { label: 'Add Document', icon: < NoteAddIcon /> },
    { label: 'Add Website', icon: < WebIcon /> },
    { label: 'Add Video', icon: < OndemandVideoIcon /> }
  ]

  const handleOptionSelect = (option, position) => {
    const resourceIndex = position ? getResourceIndexAtPosition(position.y) : resources.length
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
    console.log('resourceElements', resourceElements)
    for (let i=0; i < resourceElements.length; i++) {
      const rect = resourceElements[i].getBoundingClientRect()
      if (yPosition < rect.top + rect.height / 2) {
        return i
      }
    }
    return resources.length
  }

  console.log('current state of resources', resources)

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
          onClick={() => handleSaveLesson(lessonTitle, resources)}>Save Lesson
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
*/