/* eslint-disable react/prop-types */
import CustomContextMenu from './CustomContextMenu'
import { useDeleteLesson } from '../hooks/useDeleteLesson'
import { useNavigate } from 'react-router-dom'
import { Edit as EditIcon, Delete as DeleteIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'

const LessonListContextMenuHandler = ({ selectedLesson, contextPosition, setContextPosition }) => {
  const { handleDeleteLesson } = useDeleteLesson()
  const navigate = useNavigate()

  const contextMenuOptions = [
    { label: 'Open in new window', value: 'open', icon: <OpenInNewIcon /> },
    { label: 'Edit lesson', value: 'edit', icon: <EditIcon /> },
    { label: 'Delete lesson', value: 'delete', icon: <DeleteIcon /> }
  ]

  const handleOptionSelect = (option, event) => {
    event.stopPropagation()
    console.log('Option selected:', option.value)

    if (option.value === 'delete') {
      handleDeleteLesson(selectedLesson.id)
    } else if (option.value === 'open') {
      window.open(`/lessons/${selectedLesson.id}`, '_blank')
    } else if (option.value === 'edit') {
      navigate(`/create/${selectedLesson.id}`)
    }
    setContextPosition(null)
  }

  return (
    <CustomContextMenu
      options={contextMenuOptions}
      position={contextPosition}
      onOptionSelect={handleOptionSelect}
      onClose={() => setContextPosition(null)}
    />
  )           
}

export default LessonListContextMenuHandler

/* no right click at least
import CustomContextMenu from './CustomContextMenu'
import { useDeleteLesson } from '../hooks/useDeleteLesson'
import { useNavigate } from 'react-router-dom'
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon, Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material'

const LessonListContextMenuHandler = ({ selectedLesson, contextPosition, setContextPosition }) => {
  const { handleDeleteLesson } = useDeleteLesson()
  const navigate = useNavigate()

  console.log('contextPosition', contextPosition)
  console.log('selectedLesson', selectedLesson)

  const contextMenuOptions = [
    { label: 'Open in new window', value: 'open', icon: <OpenInNewIcon /> },
    { label: 'Edit lesson', value: 'edit', icon: <EditIcon /> },
    { label: 'Delete lesson', value: 'delete', icon: <DeleteIcon /> }
  ]

  const handleOptionSelect = (option, event) => {
    event.stopPropagation()
    console.log('Option selected:', option.value)

    if (option.value === 'delete') {
      handleDeleteLesson(selectedLesson.id)
    } else if (option.value === 'open') {
      window.open(`/lessons/${selectedLesson.id}`, '_blank')
    } else if (option.value === 'edit') {
      navigate(`/create/${selectedLesson.id}`)
    }
    setContextPosition(null)
  }

  const handleVertIconClick = (event) => {
    event.stopPropagation()
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  return (
    <>
      <MoreVertIcon 
        className='more-vert-icon'
        onClick={(event) => handleVertIconClick(event, selectedLesson)} 
      />
      {contextPosition && (
        <CustomContextMenu
          options={contextMenuOptions}
          position={contextPosition}
          onOptionSelect={handleOptionSelect}
          onClose={() => setContextPosition(null)}
        />
      )}              
    </>
  )
}

export default LessonListContextMenuHandler
 */