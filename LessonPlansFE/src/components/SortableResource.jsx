/* eslint-disable react/prop-types */
import { useSortable,} from '@dnd-kit/sortable'
import { useDispatch } from 'react-redux'
import { deleteResource } from '../features/lessons/resourcesSlice'
import {CSS} from '@dnd-kit/utilities'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'


const SortableResource = ({ id, resource, sectionId }) => {
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

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className='resource-item'
      {...attributes} 
      {...listeners}
    >
      <div>
        {resource.type === 'text' && 
          <TextDisplay title={resource.title} content={resource.content} />}
        {resource.type === 'document' && 
          <DocumentDisplay title={resource.title} link={resource.link} />}
        {resource.type === 'website' && 
          <WebsiteDisplay title={resource.title} link={resource.link} />}
        {resource.type === 'video' &&
          <VideoDisplay 
            title={resource.title} link={resource.link} 
            startTime={resource.startTime} endTime={resource.endTime}/>}
      </div>

    <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
 </div>
  );
}

export default SortableResource

/* prior to sections
import { useSortable,} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'

const SortableItem = ({ id, resource, handleDeleteResource }) => {
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
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className='resource-item'
      {...attributes} 
      {...listeners}
    >
      <div>
        {resource.type === 'text' && 
          <TextDisplay title={resource.title} content={resource.content} />}
        {resource.type === 'document' && 
          <DocumentDisplay title={resource.title} link={resource.link} />}
        {resource.type === 'website' && 
          <WebsiteDisplay title={resource.title} link={resource.link} />}
        {resource.type === 'video' &&
          <VideoDisplay 
            title={resource.title} link={resource.link} 
            startTime={resource.startTime} endTime={resource.endTime}/>}
      </div>
    <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
 </div>
  );
}

export default SortableItem
*/