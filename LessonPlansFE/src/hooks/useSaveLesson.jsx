/* eslint-disable no-unused-vars */
import { useSelector, useDispatch } from 'react-redux'
import { fetchLessons } from '../features/lessons/lessonsSlice'
import { useMutation } from '@apollo/client'
import { ADD_LESSON, UPDATE_LESSON, GET_LESSONS, GET_LESSON } from '../queries'
import { useState } from 'react'

export const useSaveLesson = (setCurrentLesson) => {
  const currentUser = useSelector((state) => state.auth.user)
  const [isSaving, setIsSaving] = useState(false)
  const [addLessonMutation] = useMutation(ADD_LESSON, {
    refetchQueries: [ { query: GET_LESSON }, { query: GET_LESSONS } ]
  })
  const [updateLessonMutation] = useMutation(UPDATE_LESSON, {
    refetchQueries: [ { query: GET_LESSON }, { query: GET_LESSONS } ]
  })
  const dispatch = useDispatch()

  const handleSaveLesson = async (lesson) => {
    if (!currentUser) {
      console.log('Cannot save lesson if user is not signed in')
      return
    }

    if (!lesson.title) {
      alert('Please add a title before saving')
      return
    }

    //had to add this to prevent an update after a save
    if (isSaving) {
      console.log('Save/Update already in progress', isSaving)
      return
    }

    setIsSaving(true)

    try {
      let result
      const dateModified = new Date().toISOString()
      const sections = lesson.sections.map(({ __typename, ...section }) => section)
      const resources = lesson.resources.map(({ __typename, ...resource }) => resource)
      console.log('sections', sections)
      console.log('resources', resources)
      
      if (lesson.id) {
        console.log('was updating attempted?')
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
        console.log('was saving attempted?')
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
//        dispatch(fetchLessons())
        alert('Lesson saved')
        const newLessonId = result.data.addLesson.id
        setCurrentLesson({ ...lesson, id: newLessonId })
        lesson.id = newLessonId
      }
      return result
    } catch (error) {
      console.log('Error in saving lesson', error)
      alert('Lesson did not save')
    } finally {
      setIsSaving(false)
    } 
  } 
  return { handleSaveLesson }
}