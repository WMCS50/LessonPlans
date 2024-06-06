import { useDispatch } from 'react-redux'
import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()

  const handleSaveLesson = async (lesson) => {
    if (!lesson.title || lesson.resources.length === 0) {
      alert('Please add a title and at least one resource before saving')
      return
    }

    try {
      let result
      if (lesson.id) {
        result = await dispatch(updateLesson({ id: lesson.id, lesson })).unwrap()
        alert('Lesson updated')
      } else {
      result = await dispatch(addLesson(lesson)).unwrap()
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

/*
import { useDispatch } from 'react-redux'
import { addLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()

  const handleSaveLesson = async (lessonTitle, resources) => {
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
  return { handleSaveLesson }
}
*/