/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import SortableResource from './SortableResource'
import DragAndDropHandler from './DragAndDropHandler'
import { reorderResources } from '../features/lessons/resourcesSlice'
import './ResourceType.css'

const ResourceList = ({ sectionId }) => {
  const resources = useSelector((state) => state.resources)
  const sectionResources = resources.filter(resource => resource.sectionId === sectionId)

  return (
    <div>
      <DragAndDropHandler 
        items={sectionResources.map(resource => resource.id)} 
        onReorder={(payload) => reorderResources({ ...payload, sectionId } )}
      >
        <div className='resource-display'>
          {sectionResources.map((resource) => (
            <SortableResource 
              key={resource.id} 
              id={resource.id} 
              resource={resource} 
              sectionId={sectionId} 
            />  
          ))}
        </div>
        </DragAndDropHandler>
    </div>
  )
}

export default ResourceList