/* eslint-disable react/prop-types */
import CustomContextMenu from './CustomContextMenu'
import { useDispatch } from 'react-redux'
import { useDeleteResource } from '../hooks/useDeleteResource'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { Edit as EditIcon, Delete as DeleteIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material'

const ResourceContextMenuHandler = ({ selectedResource, sectionId, contextPosition, setContextPosition }) => {
  const dispatch = useDispatch()
  const { handleDeleteResource } = useDeleteResource()

  let contextMenuOptions = [
    { label: 'Edit Resource', value: 'edit', icon: <EditIcon /> },
    { label: 'Delete Resource', value: 'delete', icon: <DeleteIcon /> }
  ]

  if (selectedResource.type === 'document') {
    contextMenuOptions = [{ label: 'Open in new window', value: 'open', icon: <OpenInNewIcon /> }, ...contextMenuOptions]
  }
  
  const handleOptionSelect = (option, event) => {
    event.stopPropagation()
    if (option.value === 'delete') {
      handleDeleteResource({resourceId: selectedResource.id, sectionId: sectionId})
    } else if (option.value === 'open') {
      window.open(selectedResource.link, '_blank', 'noopener,noreferrer')
    } else if (option.value === 'edit') {
      dispatch(setActiveForm({ type: selectedResource.type, resource: selectedResource, sectionId }))
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

export default ResourceContextMenuHandler