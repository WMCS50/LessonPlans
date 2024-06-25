/* eslint-disable react/prop-types */
import { useSortable} from '@dnd-kit/sortable'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteResource, updateResource } from '../features/lessons/resourcesSlice'
import {CSS} from '@dnd-kit/utilities'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import AddEditResource from './AddEditResource'

const SortableResource = ({ id, resource, sectionId }) => {
  const [isEditing, setIsEditing] = useState(false)
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id} )

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const dispatch = useDispatch()

  const handleDeleteResource = (resourceId) => {
    dispatch(deleteResource({ resourceId, sectionId}))
  }

  const handleSaveEdit = (resource) => {
    dispatch(updateResource({ resourceId: id, ...resource }))
    setIsEditing(false)
  }

  const renderDisplay = () => {
    switch (resource.type) {
      case 'text':  
        return <TextDisplay resource={resource} />
      case 'document': 
        return <DocumentDisplay title={resource.title} link={resource.link} />
      case 'website': 
        return <WebsiteDisplay title={resource.title} link={resource.link} />
      case 'video':
        return <VideoDisplay 
          title={resource.title} 
          link={resource.link} 
          startTime={resource.startTime} 
          endTime={resource.endTime}
        />
      default:
        return null
    }
  }
    
  return (
    <div className='resource-item'
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
    >
    <div>
      {renderDisplay()}
      <button onClick={() => setIsEditing(true)}>Edit</button>
      <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
    </div>
    {isEditing && (
      <AddEditResource
        open={isEditing}
        onClose={() => setIsEditing(false)}
        onAddResource={handleSaveEdit}
        resource={resource}
        type={resource.type}
      />
    )}
 </div>
  )
}

export default SortableResource