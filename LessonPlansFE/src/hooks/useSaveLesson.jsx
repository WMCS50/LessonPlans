import { useDispatch, useSelector } from 'react-redux'
import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  const currentUserId = currentUser.user.id

  const handleSaveLesson = async (lesson) => {
    if (!lesson.title || lesson.resources.length === 0) {
      alert('Please add a title and at least one resource before saving')
      return
    }

    try {
      let result
      if (lesson.id) {
        result = await dispatch(updateLesson({ id: lesson.id, lesson: { ...lesson, createdBy: currentUserId} })).unwrap()
        console.log('lesson stuff', result)
        alert('Lesson updated')
      } else {
      result = await dispatch(addLesson({ ...lesson, createdBy: currentUserId })).unwrap()
      alert('Lesson saved')
      }
      console.log(result)
      return result
    } catch (error) {
      console.error('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  } 
  return { handleSaveLesson }
}