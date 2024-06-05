/* import { useDispatch } from 'react-redux'
import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()

  const handleSave = async (lesson) => {
    if (!lesson.title || lesson.resources.length === 0) {
      alert('Please add a title and at least one resource before saving')
      return
    }

    try {
      if (lesson.id) {
        await dispatch(updateLesson({ id: lesson.id, lesson })).unwrap()
        alert('Lesson updated successfully')
      } else {
        await dispatch(addLesson(lesson)).unwrap()
        alert('Lesson saved successfully')
      }
    } catch (error) {
      console.error('Error saving lesson', error)
      alert('Lesson could not be saved')
    }
  }

  return { handleSave }
} */


import { useDispatch } from 'react-redux'
import { addLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()

  const handleSave = async (lessonTitle, resources) => {
    if (!lessonTitle || resources.length === 0) {
      alert('Please add a title and at least one resource before saving')
      return
    }
    try {
      await dispatch(addLesson({
        title: lessonTitle,
        resources: resources
      })).unwrap()
      alert('Lesson saved')
    } catch (error) {
      console.error('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  } 
  return { handleSave}
}