import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
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
import UserMenu from './UserMenu'
import FileMenu from './FileMenu'
import FileMenuDialog from './FileMenuDialog'
import LessonListDialog from './LessonListDialog'

const LessonCreateView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const { handleSaveLesson } = useSaveLesson()
  const [contextPosition, setContextPosition] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      resources: []
    })
  const [fileMenuDialogOpen, setFileMenuDialogOpen] = useState(false)
  const [fileMenuDialogType, setFileMenuDialogType] = useState('')
  const [fileMenuDialogInputValue, setFileMenuDialogInputValue ] = useState('')
  const [lessonListDialogOpen, setLessonListDialogOpen] = useState(false)

//Resets title and resources when creating a new lesson
  useEffect(() => {
    dispatch(resetResources())
    if (!id) {
      setCurrentLesson({
        id: null,
        title: '',
        resources: []
      })
    }
  }, [dispatch, id])

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

  const handleFileMenuClick = async (item) => {
    if (item === 'Save') {
      await handleSave()
    }
    if (item === 'Save As New') {
      setFileMenuDialogType('saveAsNew')
      setFileMenuDialogOpen(true)
    }
    if (item === 'Create New') {
      setFileMenuDialogType('createNew')
      setFileMenuDialogOpen(true)
    }
    if (item === 'Open') {
      setLessonListDialogOpen(true)
    }
  }

  const handleFileMenuDialogSave = async (inputValue, shouldSave) => {
    if (fileMenuDialogType === 'saveAsNew') {
      const newLesson = { ...currentLesson, title: inputValue, id: null, resources: resources }
      const result = await handleSaveLesson(newLesson)
      if (result && result.id) {
        navigate(`/create/${result.id}`)
      }
    } else if (fileMenuDialogType === 'createNew') {
      if (shouldSave) {
        await handleSave()
      }
      dispatch(resetResources())
      setCurrentLesson({
        id: null,
        title: '',
        resources: []
      })
      navigate('/create')
    } else if (fileMenuDialogType === 'openLesson') {
      if (shouldSave) {
        await handleSave()
      }
      navigate(`/create/${inputValue}`)
    }
    setFileMenuDialogOpen(false)
  }

  const handleLessonSelect = (lesson) => {
    setFileMenuDialogType('openLesson')
    setFileMenuDialogInputValue(lesson.id)
    setFileMenuDialogOpen(true)
  }
console.log('filemenudialogtype', fileMenuDialogType)
  return (
    <div className='lesson-create-view' onContextMenu={handleContextMenu}>
      <div className='above-app-bar'>
        <FileMenu className='file-menu' onItemClick={handleFileMenuClick} />
        <input 
          className='lesson-title-input'
          type='text'
          placeholder='Enter Lesson Title'
          value={currentLesson.title}
          onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value})}
        />
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
      <FileMenuDialog 
        open={fileMenuDialogOpen}
        onClose={() => setFileMenuDialogOpen(false)}
        onSave={handleFileMenuDialogSave}
        title={fileMenuDialogType === 'saveAsNew' ? 'Save As New' : (fileMenuDialogType === 'createNew' ? 'Create New' : 'Open Lesson')}
        content={fileMenuDialogType === 'saveAsNew' ? 'Please enter a new title:' : 'Do you want to save the current lesson before creating a new one?'}
        inputLabel={fileMenuDialogType === 'saveAsNew' ? 'New Title' : null}
        inputValue={fileMenuDialogInputValue}
        setInputValue={setFileMenuDialogInputValue}
        showNoOption={fileMenuDialogType === 'createNew' || fileMenuDialogType === 'openLesson'}
      />
      <LessonListDialog
        open={lessonListDialogOpen}
        onClose={() => setLessonListDialogOpen(false)}
        onSelect={handleLessonSelect}
      />
    </div>
  )
}

export default LessonCreateView