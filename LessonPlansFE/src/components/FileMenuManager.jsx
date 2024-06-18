/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSaveLesson } from '../hooks/useSaveLesson'
import { resetResources } from '../features/lessons/resourcesSlice'
import { resetSections } from '../features/lessons/sectionsSlice'
import FileMenu from './FileMenu'
import FileMenuDialog from './FileMenuDialog'
import LessonListDialog from './LessonListDialog'

const FileMenuManager = ({ currentLesson, setCurrentLesson, resources, sections, fileMenuItems, skipDialogs }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleSaveLesson } = useSaveLesson()
  const [fileMenuDialogOpen, setFileMenuDialogOpen] = useState(false)
  const [fileMenuDialogType, setFileMenuDialogType] = useState('')
  const [fileMenuDialogInputValue, setFileMenuDialogInputValue ] = useState('')
  const [lessonListDialogOpen, setLessonListDialogOpen] = useState(false)

  //constructs a lesson object then calls handleSaveLesson
  const handleSave = async () => {
    const lesson = { ...currentLesson, resources, sections }
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
      if (skipDialogs) {
        navigate('/create');
      } else {
        setFileMenuDialogType('createNew');
        setFileMenuDialogOpen(true);
      }
    }
    if (item === 'Open') {
      setFileMenuDialogType('openLesson')
      setLessonListDialogOpen(true)
    }
    if (item === 'Edit') {
      navigate(`/create/${currentLesson.id}`)
    }
  }

  const handleFileMenuDialogSave = async (inputValue, shouldSave) => {
    if (fileMenuDialogType === 'saveAsNew') {
      const newLesson = { ...currentLesson, title: inputValue, id: null, resources, sections }
      const result = await handleSaveLesson(newLesson)
      if (result && result.id) {
        navigate(`/create/${result.id}`)
      }
    } else if (fileMenuDialogType === 'createNew') {
      if (shouldSave) {
        await handleSave()
      }
      dispatch(resetResources())
      dispatch(resetSections())
      setCurrentLesson({
        id: null,
        title: '',
        sections: []
      })
      navigate('/create')
    } else if (fileMenuDialogType === 'openLesson') {
      if (shouldSave && !skipDialogs) {
        await handleSave()
      }
      navigate(`/create/${inputValue}`)
    }
    setFileMenuDialogOpen(false)
  }

  const handleLessonSelect = (lesson) => {
    setFileMenuDialogType('openLesson')
    setFileMenuDialogInputValue(lesson.id)
    setFileMenuDialogOpen(!skipDialogs)
    if (skipDialogs) {
      navigate(`/create/${lesson.id}`)
    }
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

/*prior to sections

import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSaveLesson } from '../hooks/useSaveLesson'
import { resetResources } from '../features/lessons/resourcesSlice'
import FileMenu from './FileMenu'
import FileMenuDialog from './FileMenuDialog'
import LessonListDialog from './LessonListDialog'

const FileMenuManager = ({ currentLesson, setCurrentLesson, resources, fileMenuItems, skipDialogs }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleSaveLesson } = useSaveLesson()
  const [fileMenuDialogOpen, setFileMenuDialogOpen] = useState(false)
  const [fileMenuDialogType, setFileMenuDialogType] = useState('')
  const [fileMenuDialogInputValue, setFileMenuDialogInputValue ] = useState('')
  const [lessonListDialogOpen, setLessonListDialogOpen] = useState(false)

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
      if (skipDialogs) {
        navigate('/create');
      } else {
        setFileMenuDialogType('createNew');
        setFileMenuDialogOpen(true);
      }
    }
    if (item === 'Open') {
      setFileMenuDialogType('openLesson')
      setLessonListDialogOpen(true)
    }
    if (item === 'Edit') {
      navigate(`/create/${currentLesson.id}`)
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
      if (shouldSave && !skipDialogs) {
        await handleSave()
      }
      navigate(`/create/${inputValue}`)
    }
    setFileMenuDialogOpen(false)
  }

  const handleLessonSelect = (lesson) => {
    setFileMenuDialogType('openLesson')
    setFileMenuDialogInputValue(lesson.id)
    setFileMenuDialogOpen(!skipDialogs)
    if (skipDialogs) {
      navigate(`/create/${lesson.id}`)
    }
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
*/