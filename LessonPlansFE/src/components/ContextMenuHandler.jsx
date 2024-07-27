import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import CustomContextMenu from './CustomContextMenu'
import useClickOutside from '../hooks/useClickOutside'
import {
  TextFields as TextFieldsIcon, NoteAdd as NoteAddIcon, Web as WebIcon,
  OndemandVideo as OndemandVideoIcon, AddAPhoto as AddAPhotoIcon,
  ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material'

const ContextMenuHandler = ({ contextPosition, setContextPosition, currentLesson }) => {
  const activeSectionId = useSelector((state) => state.activeSection)
  const dispatch = useDispatch()

  const contextMenuOptions = [
    { label: 'Add Picture', icon: <AddAPhotoIcon /> },
    { label: 'Add Text', icon: <TextFieldsIcon /> },
    { label: 'Add Document', icon: <NoteAddIcon /> },
    { label: 'Add Website', icon: <WebIcon /> },
    { label: 'Add Video', icon: <OndemandVideoIcon /> },
    { label: 'Add Section Above', icon: <ArrowUpwardIcon /> },
    { label: 'Add Section Below', icon: <ArrowDownwardIcon /> }
  ]

  // determine the index where a new resource will be inserted
  // based on the vertical position of a right-click event
  const getResourceIndexAtPosition = (yPosition) => {
    const resourceElements = document.querySelectorAll('.resource-item')
    for (let i = 0; i < resourceElements.length; i++) {
      const rect = resourceElements[i].getBoundingClientRect()
      if (yPosition < rect.top + rect.height / 2) {
        console.log('i', i)
        return i
      }
    }
    return currentLesson.resources.length
  }

  const handleOptionSelect = (option) => {
    if (option.label === 'Add Section Above') {
      dispatch(setActiveForm({ type: 'Add Section', position: 'above', section: activeSectionId }))
    } else if (option.label === 'Add Section Below') {
      dispatch(setActiveForm({ type: 'Add Section', position: 'below', section: activeSectionId }))
    } else {
      const resourceIndex = contextPosition ? getResourceIndexAtPosition(contextPosition.y) : currentLesson.resources.length
      dispatch(setActiveForm({ type: option.label, index: resourceIndex }))
    }
    setContextPosition(null)
  }

  const contextMenuRef = useClickOutside(() => setContextPosition(null))

  return (
    <div ref={contextMenuRef} style={{ width: '100%', height: '100%' }}>
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

export default ContextMenuHandler