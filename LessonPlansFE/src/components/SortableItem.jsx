/* eslint-disable react/prop-types */
import { useSortable,} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
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