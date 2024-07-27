import { useSelector } from 'react-redux'
import CustomContextMenu from './CustomContextMenu'
import { useDeleteLesson } from '../hooks/useDeleteLesson'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ShareLessonModal from './ShareLessonModal'
import { Edit as EditIcon, Delete as DeleteIcon, OpenInNew as OpenInNewIcon, Share as ShareIcon } from '@mui/icons-material'

const LessonListContextMenuHandler = ({ selectedLesson, contextPosition, setContextPosition }) => {
  const currentUser = useSelector((state) => state.auth.user)
  const { handleDeleteLesson } = useDeleteLesson()
  const [showShareModal, setShowShareModal] = useState(false)
  const navigate = useNavigate()

  const contextMenuOptions = [
    { label: 'Open in new window', value: 'open', icon: <OpenInNewIcon /> },
    { label: 'Edit lesson', value: 'edit', icon: <EditIcon /> },
    { label: 'Delete lesson', value: 'delete', icon: <DeleteIcon /> },
  ]

  if (selectedLesson.createdBy === currentUser.username) {
    contextMenuOptions.push({ label: 'Share lesson', value: 'share', icon: <ShareIcon /> })
  }

  const handleOptionSelect = (option, event) => {
    event.stopPropagation()
    if (option.value === 'delete') {
      handleDeleteLesson(selectedLesson.id)
      setContextPosition(null)
    } else if (option.value === 'open') {
      window.open(`/lessons/${selectedLesson.id}`, '_blank')
      setContextPosition(null)
    } else if (option.value === 'edit') {
      navigate(`/create/${selectedLesson.id}`)
      setContextPosition(null)
    } else if (option.value === 'share') {
      console.log('Share option selected')
      setShowShareModal(true)
    }
  }

  useEffect(() => {
    console.log('showShareModal state changed:', showShareModal)
  }, [showShareModal])

  return (
    <>
      <CustomContextMenu
        options={contextMenuOptions}
        position={contextPosition}
        onOptionSelect={handleOptionSelect}
      />
      {showShareModal && (
        <ShareLessonModal
          lessonId={selectedLesson.id}
          open={showShareModal}
          onClose={() => setShowShareModal(false)} />
      )}
    </>
  )
}

export default LessonListContextMenuHandler