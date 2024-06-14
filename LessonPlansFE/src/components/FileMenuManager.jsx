/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSaveLesson } from '../hooks/useSaveLesson'
import { resetResources } from '../features/lessons/resourcesSlice'
import FileMenu from './FileMenu'
import FileMenuDialog from './FileMenuDialog'
import LessonListDialog from './LessonListDialog'

const FileMenuManager = ({ currentLesson, setCurrentLesson, resources }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleSaveLesson } = useSaveLesson()
  const [fileMenuDialogOpen, setFileMenuDialogOpen] = useState(false)
  const [fileMenuDialogType, setFileMenuDialogType] = useState('')
  const [fileMenuDialogInputValue, setFileMenuDialogInputValue ] = useState('')
  const [lessonListDialogOpen, setLessonListDialogOpen] = useState(false)

  const fileMenuItems = ['Save', 'Save As New','Create New', 'Open', 'Share']

  //constructs a lesson object then calls handleSaveLesson
  const handleSave = async () => {
    const lesson = { ...currentLesson, resources: resources }
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
      setFileMenuDialogType('openLesson'); // Added this line
      setLessonListDialogOpen(true);
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
    <div>
      <FileMenu className='file-menu' items={fileMenuItems} onItemClick={handleFileMenuClick} />

      <FileMenuDialog 
        open={fileMenuDialogOpen}
        onClose={() => setFileMenuDialogOpen(false)}
        onSave={handleFileMenuDialogSave}
        title={fileMenuDialogType === 'saveAsNew' ? 'Save As New' : (fileMenuDialogType === 'createNew' ? 'Create New' : 'Open Lesson')}
        content={fileMenuDialogType === 'saveAsNew' ? 'Please enter a new title:' : (fileMenuDialogType === 'createNew' ? 'Do you want to save the current lesson before creating a new one?' : 'Do you want to save the current lesson before opening?')}
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

export default FileMenuManager