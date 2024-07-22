import { useSelector, useDispatch } from 'react-redux'
import { fetchLessons } from '../features/lessons/lessonsSlice'
import { useMutation } from '@apollo/client'
import { ADD_LESSON, UPDATE_LESSON } from '../queries'
import { useState } from 'react'

export const useSaveLesson = (refetchLesson, setCurrentLesson) => {
  const currentUser = useSelector((state) => state.auth.user)
  const [addLessonMutation] = useMutation(ADD_LESSON)
  const [updateLessonMutation] = useMutation(UPDATE_LESSON)
  const [isSaving, setIsSaving] = useState(false)
  
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
        alert('Lesson saved')
        const newLessonId = result.data.addLesson.id
        setCurrentLesson({ ...lesson, id: newLessonId })
        lesson.id = newLessonId
      }
      //Refetch the lesson after save or update
      if (refetchLesson && lesson.id) {
        await refetchLesson({ id: lesson.id })
      }
      // Fetch all lessons to update the LessonList
      dispatch(fetchLessons())
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