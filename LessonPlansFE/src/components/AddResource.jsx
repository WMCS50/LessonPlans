import { useState } from 'react'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'

const AddResource = () => {
  const [resourceType, setResourceType] = useState('')

  return (
    <div>
      <button onClick={() => setResourceType('document')}>Add Document</button>
      <button onClick={() => setResourceType('website')}>Add Website</button>
      <button onClick={() => setResourceType('video')}>Add Video</button>

      {resourceType === 'document' && <AddDocument />}
      {resourceType === 'website' && <AddWebsite />}
      {resourceType === 'video' && <AddVideo />}
    </div>
  )
}

export default AddResource