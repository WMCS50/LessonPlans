import { useDispatch, useSelector } from 'react-redux'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'
import { addResource } from '../features/lessons/resourcesSlice'

const ActiveForm = () => {
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)

  const handleAddResource = (resource) => {
    dispatch(addResource(resource))
  }

  switch (activeForm) {
    case 'Add Document':
      return <AddDocument onAddResource={handleAddResource} />
    case 'Add Website':
      return <AddWebsite onAddResource={handleAddResource} />
    case 'Add Video':
      return <AddVideo onAddResource={handleAddResource} />
    default:
      return null
  }
}

export default ActiveForm
