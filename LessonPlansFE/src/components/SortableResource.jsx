/* eslint-disable react/prop-types */
import { useSortable} from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteResource, updateResource } from '../features/lessons/resourcesSlice'
import {CSS} from '@dnd-kit/utilities'
import TextEditor from './TextEditor'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import AddResource from './AddResource'

const SortableResource = ({ id, resource, sectionId }) => {
  const [initialText, setInitialText] = useState(undefined)
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

  useEffect(() => {
    setTimeout(() => setInitialText(resource.content), 500)
  // had to follow TinyMCE documentation here precisely 
  // in setting initial value as it doesn't work otherwise
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDeleteResource = (resourceId) => {
    dispatch(deleteResource({ resourceId, sectionId}))
  }

  const handleUpdateTextContent = (resourceId, content) => {
    dispatch(updateResource({ resourceId, content }))
  }

  const handleSaveEdit = (resource) => {
    dispatch(updateResource({ resourceId: id, ...resource }))
    setIsEditing(false)
  }

  const renderDisplay = () => {
    switch (resource.type) {
      case 'text':  
      return (
        <TextEditor className='text-editor-container'
          initialValue={initialText}
          onEditorChange={(content) => handleUpdateTextContent(resource.id, content)}
        />
      )
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
      <AddResource
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