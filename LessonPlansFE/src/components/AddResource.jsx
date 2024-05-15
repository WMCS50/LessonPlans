import { useState } from 'react'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'

const AddResource = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  const [resourceType, setResourceType] = useState('')

  return (
    <div>
      <select onChange={(e) => setResourceType(e.target.value)} value={resourceType}>
        <option value=''>Select Resource Type</option>
        <option value='document'>Document</option>
        <option value='website'>Website</option>
        <option value='video'>Video</option>
      </select>
      {resourceType === 'document' && <AddDocument onAddResource={onAddResource} />}
      {resourceType === 'website' && <AddWebsite onAddResource={onAddResource} />}
      {resourceType === 'video' && <AddVideo onAddResource={onAddResource} />}
    </div>
  )
}

export default AddResource