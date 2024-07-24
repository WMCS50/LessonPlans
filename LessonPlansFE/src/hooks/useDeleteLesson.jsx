import { useDispatch } from 'react-redux'
import { deleteLesson, fetchLessons } from '../features/lessons/lessonsSlice'

export const useDeleteLesson = () => {
  const dispatch = useDispatch()

  const handleDeleteLesson = async (lessonId) => {
    const confirmed = window.confirm('Are you sure you want to delete this lesson?')
    if (!confirmed) {
      return
    }
        
    try {
      await dispatch(deleteLesson(lessonId)).unwrap()
      alert('Lesson deleted successfully')
      dispatch(fetchLessons())
    } catch (error) {
      console.error('Error in deleting lesson', error)
      alert('Lesson could not be deleted')
    }
  } 
  return { handleDeleteLesson }
}