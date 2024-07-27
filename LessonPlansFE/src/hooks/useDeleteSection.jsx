import { useDispatch } from 'react-redux'
import { deleteSection } from '../features/lessons/sectionsSlice'
import { deleteSectionResources } from '../features/lessons/resourcesSlice'

export const useDeleteSection = () => {
  const dispatch = useDispatch()

  const handleDeleteSection = async (sectionId) => {
    const confirmed = window.confirm('Are you sure you want to delete this section and all the resources within it?')
    if (!confirmed) {
      return
    }

    try {
      await dispatch(deleteSection(sectionId))
      await dispatch(deleteSectionResources(sectionId))
      alert('Resource deleted successfully')
    } catch (error) {
      console.error('Error in deleting section', error)
      alert('Section could not be deleted')
    }
  }
  return { handleDeleteSection }
}
