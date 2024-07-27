import { useDispatch } from 'react-redux'
import { deleteResource } from '../features/lessons/resourcesSlice'

export const useDeleteResource = () => {
  const dispatch = useDispatch()

  const handleDeleteResource = async (resourceId, sectionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this resource?')
    if (!confirmed) {
      return
    }

    try {
      await dispatch(deleteResource(resourceId, sectionId))
      alert('Resource deleted successfully')
    } catch (error) {
      console.error('Error in deleting resource', error)
      alert('Resource could not be deleted')
    }
  }
  return { handleDeleteResource }
}
