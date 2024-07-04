import { useDispatch, useSelector } from 'react-redux'
import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  
  const handleSaveLesson = async (lesson) => {
    if (!currentUser) {
      console.warn('Cannot save lesson if user is not signed in');
      return
    }

    const currentUserName = currentUser.user.username

    if (!lesson.title) {
      alert('Please add a title before saving')
      return
    }

    try {
      let result
      const dateModified = new Date().toISOString()

      if (lesson.id) {
        result = await dispatch(updateLesson({ id: lesson.id, lesson: { ...lesson, createdBy: currentUserName, sections: lesson.sections, dateModified } })).unwrap()
        console.log('lesson updated', result)
        alert('Lesson updated')
      } else {
        result = await dispatch(addLesson({ ...lesson, createdBy: currentUserName, sections: lesson.sections, dateModified })).unwrap()
        console.log('lesson saved', result)
        alert('Lesson saved')
      }
      return result
    } catch (error) {
      console.error('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  } 
  return { handleSaveLesson }
}