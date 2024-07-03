/* eslint-disable react/prop-types */
import { useSelector } from 'react-redux'
import SortableResource from './SortableResource'
import DragAndDropHandler from './DragAndDropHandler'
import './ResourceType.css'

const ResourceList = ({ sectionId }) => {
  const resources = useSelector((state) => state.resources)
  const sectionResources = resources.filter(resource => resource.sectionId === sectionId)


  return (
    <div>
      <DragAndDropHandler sectionResources={sectionResources} sectionId={sectionId}>
          <div className='resource-display'>
            {sectionResources.map((resource) => (
              <SortableResource key={resource.id} id={resource.id} resource={resource} sectionId={sectionId} />  
            ))}
          </div>
        </DragAndDropHandler>
    </div>
  )
}

export default ResourceList

/* 
prior to horizontal context menu
import { useSelector } from 'react-redux'
import SortableResource from './SortableResource'
import DragAndDropHandler from './DragAndDropHandler'

const ResourceList = ({ sectionId }) => {
  const resources = useSelector((state) => state.resources)
  const sectionResources = resources.filter(resource => resource.sectionId === sectionId)

  return (
    <div>
      <DragAndDropHandler sectionResources={sectionResources} sectionId={sectionId}>
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

*/