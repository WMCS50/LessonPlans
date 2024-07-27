import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useSaveLesson } from '../hooks/useSaveLesson'
import { resetResources } from '../features/lessons/resourcesSlice'
import { resetSections } from '../features/lessons/sectionsSlice'
import { fetchLessons } from '../features/lessons/lessonsSlice'

import FileMenu from './FileMenu'
import FileMenuDialog from './FileMenuDialog'
import LessonListDialog from './LessonListDialog'
import ShareLessonModal from './ShareLessonModal'

const FileMenuManager = ({
  currentLesson, setCurrentLesson, resources,
  sections, fileMenuItems, skipDialogs
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { handleSaveLesson } = useSaveLesson(setCurrentLesson)
  const [fileMenuDialogOpen, setFileMenuDialogOpen] = useState(false)
  const [fileMenuDialogType, setFileMenuDialogType] = useState('')
  const [fileMenuDialogInputValue, setFileMenuDialogInputValue ] = useState('')
  const [lessonListDialogOpen, setLessonListDialogOpen] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  //constructs a lesson object then calls handleSaveLesson
  const handleSave = async () => {
    const lesson = { ...currentLesson, resources, sections }

    const result = await handleSaveLesson(lesson, setCurrentLesson)
    if (result && !currentLesson.id) {
      setCurrentLesson({ ...lesson, id: result.data.addLesson.id })
    }
    dispatch(fetchLessons())
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
        navigate('/create')
      } else {
        setFileMenuDialogType('createNew')
        setFileMenuDialogOpen(true)
      }
    }
    if (item === 'Open') {
      setFileMenuDialogType('openLesson')
      setLessonListDialogOpen(true)
    }
    if (item === 'Edit') {
      navigate(`/create/${currentLesson.id}`)
    }
    if (item === 'Share') {
      setShowShareModal(true)
    }
  }

  const handleFileMenuDialogSave = async (inputValue, shouldSave) => {
    if (fileMenuDialogType === 'saveAsNew') {
      const newLesson = { ...currentLesson, title: inputValue, id: null, resources, sections }

      const result = await handleSaveLesson(newLesson, setCurrentLesson)
      if (result && result.data.addLesson.id) {
        navigate(`/create/${result.data.addLesson.id}`)
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
      {showShareModal && (
        <ShareLessonModal
          lessonId={currentLesson.id}
          open={showShareModal}
          onClose={() => setShowShareModal(false)} />
      )}
    </div>
  )
}

export default FileMenuManager