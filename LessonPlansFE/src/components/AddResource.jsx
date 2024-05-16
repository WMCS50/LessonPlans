import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'

const AddResource = ({ onAddResource }) => { // eslint-disable-line react/prop-types
  return (
    <div className='resource-toolbar'>
      <AddDocument onAddResource={onAddResource} />
      <AddWebsite onAddResource={onAddResource} />
      <AddVideo onAddResource={onAddResource} />
    </div>
  )
}

export default AddResource