/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import ResourceContextMenuHandler from './ResourceContextMenuHandler'
import { MoreHoriz as MoreHorizIcon } from '@mui/icons-material'
import './SortableResource.css'

const SortableResource = ({ id, resource, sectionId }) => {
  const [selectedResource, setSelectedResource] = useState(null)
  const [contextPosition, setContextPosition] = useState(null)

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

  const handleHorizIconClick = (event, resource) => {
    event.stopPropagation()
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
    setSelectedResource(resource)
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
    <div>
      <div className='resource-item'
        ref={setNodeRef} 
        style={style} 
        {...attributes} 
        {...listeners}
      >
        <div>
          {renderDisplay()}
          <div className='resource-actions'>
            <MoreHorizIcon className='more-horiz-icon' onClick={(event) => handleHorizIconClick(event, resource)} />
          </div>
        </div>
      </div>
      {contextPosition && (
          <ResourceContextMenuHandler
            contextPosition={contextPosition}
            setContextPosition={setContextPosition}
            selectedResource={selectedResource}
            sectionId={sectionId}
          />
        )}
    </div>
  )
}

export default SortableResource