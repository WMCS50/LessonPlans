import { useSelector } from 'react-redux'
//import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'
import { useMutation } from '@apollo/client'
import { ADD_LESSON, UPDATE_LESSON } from '../queries'

export const useSaveLesson = () => {
  //const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  const [addLessonMutation] = useMutation(ADD_LESSON)
  const [updateLessonMutation] = useMutation(UPDATE_LESSON)
  
  const handleSaveLesson = async (lesson) => {
    if (!currentUser) {
      console.log('Cannot save lesson if user is not signed in')
      return
    }

    if (!lesson.title) {
      alert('Please add a title before saving')
      return
    }

    try {
      let result
      const dateModified = new Date().toISOString()

      const sections = lesson.sections.map(section => section.id)
      const resources = lesson.resources.map(resource => resource.id)

      if (lesson.id) {
        result = await updateLessonMutation({ 
          variables: {
            id: lesson.id,
            title: lesson.title,
            sections,
            resources,
            dateModified,
            courseAssociations: lesson.courseAssociations
          }
        })
        console.log('lesson updated', result)
        alert('Lesson updated')
      } else {
        result = await addLessonMutation({           
          variables: {
            title: lesson.title,
            sections,
            resources,
            dateModified,
            courseAssociations: lesson.courseAssociations
          }
        })
        console.log('lesson saved', result)
        alert('Lesson saved')
      }
      return result
    } catch (error) {
      console.log('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  } 
  return { handleSaveLesson }
}

/* 
prior to graphql
import { useDispatch, useSelector } from 'react-redux'
import { addLesson, updateLesson } from '../features/lessons/lessonsSlice'

export const useSaveLesson = () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.auth.user)
  
  const handleSaveLesson = async (lesson) => {
    if (!currentUser) {
      console.log('Cannot save lesson if user is not signed in')
      return
    }

    const currentUserName = currentUser.username

    if (!lesson.title) {
      alert('Please add a title before saving')
      return
    }

    try {
      let result
      const dateModified = new Date().toISOString()

      const sections = lesson.sections.map(section => section.id)
      const resources = lesson.resources.map(resource => resource.id)

      if (lesson.id) {
        result = await dispatch(updateLesson({ id: lesson.id, lesson: { ...lesson, sections, resources, createdBy: currentUserName, dateModified } })).unwrap()
        console.log('lesson updated', result)
        alert('Lesson updated')
      } else {
        result = await dispatch(addLesson({ ...lesson, sections, resources, createdBy: currentUserName, dateModified })).unwrap()
        console.log('lesson saved', result)
        alert('Lesson saved')
      }
      return result
    } catch (error) {
      console.log('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  } 
  return { handleSaveLesson }
} */