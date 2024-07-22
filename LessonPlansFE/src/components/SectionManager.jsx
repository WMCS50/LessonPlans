/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addSection, updateSections } from '../features/lessons/sectionsSlice'
//import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const SectionManager = ({ activeForm, sections }) => {
  const dispatch = useDispatch()
  const { ObjectId } = mongoose.Types

  useEffect(() => {
    if (activeForm && activeForm.type === 'Add Section') {
      //const newSection = { id: uuidv4() }
      const newSection = { id: new ObjectId().toString() }
      let newSections
      if (activeForm.position === 'above') {
        const index = sections.findIndex(section => section.id === activeForm.sectionId)
        newSections = [
          ...sections.slice(0, index),
          newSection,
          ...sections.slice(index)
        ]
      } else if (activeForm.position === 'below') {
        const index = sections.findIndex(section => section.id === activeForm.sectionId) + 1
        newSections = [
          ...sections.slice(0, index),
          newSection,
          ...sections.slice(index)
        ]
      } else {
        newSections = [...sections, newSection]
      }

      dispatch(addSection({ section: newSection }))
      dispatch(updateSections(newSections))
      dispatch(resetActiveForm())
    } 

  }, [activeForm, dispatch, sections, ObjectId])
  
  return null
}

export default SectionManager

/* too much gql import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useMutation } from '@apollo/client'
import { ADD_SECTION, UPDATE_SECTIONS } from '../queries'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const SectionManager = ({ activeForm, currentLesson }) => {
  const dispatch = useDispatch()
  const [addSectionMutation] = useMutation(ADD_SECTION)
  const [updateSectionsMutation] = useMutation(UPDATE_SECTIONS)

  useEffect(() => {
    if (activeForm && activeForm.type === 'Add Section') {
      const addSection = async () => {
        //Add a new section
        try {
          const response = await addSectionMutation({ variables: { 
            title: 'Untitled Section',
            lessonID: currentLesson  
          } 
        })
        
        const newSection = response.data.addSection

        //Determine the new sections array
        let newSections
           
        if (activeForm.position === 'above') {
          const index = currentLesson.sections.findIndex(section => section.id === activeForm.sectionId)
          newSections = [
            ...currentLesson.sections.slice(0, index),
            newSection,
            ...currentLesson.sections.slice(index)
          ]
        } else if (activeForm.position === 'below') {
          const index = currentLesson.sections.findIndex(section => section.id === activeForm.sectionId) + 1
          newSections = [
            ...currentLesson.sections.slice(0, index),
            newSection,
            ...currentLesson.sections.slice(index)
          ]
          } else {
            newSections = [...currentLesson.sections, newSection] 
          }  
 
          //Update sections in lesson
          await updateSectionsMutation({ variables: {
            lessonId: currentLesson.id,
            sectionIds: newSections.map(section => section.id)
            }
          })
          dispatch(resetActiveForm())
        } catch (error) {
          console.log('Error adding section', error)
        } 
      }
      addSection()
    } 
  }, [activeForm, addSectionMutation, updateSectionsMutation, dispatch, currentLesson])
  
  return null
}

export default SectionManager */

/* prior to graphql

import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addSection, updateSections } from '../features/lessons/sectionsSlice'
import mongoose from 'mongoose'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const { ObjectId } = mongoose.Types

const SectionManager = ({ activeForm, sections }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (activeForm && activeForm.type === 'Add Section') {
      const newSection = { id: new ObjectId().toString() }
      let newSections
      if (activeForm.position === 'above') {
        const index = sections.findIndex(section => section.id === activeForm.sectionId)
        newSections = [
          ...sections.slice(0, index),
          newSection,
          ...sections.slice(index)
        ]
      } else if (activeForm.position === 'below') {
        const index = sections.findIndex(section => section.id === activeForm.sectionId) + 1
        newSections = [
          ...sections.slice(0, index),
          newSection,
          ...sections.slice(index)
        ]
      } else {
        newSections = [...sections, newSection]
      }

      dispatch(addSection({ section: newSection }))
      dispatch(updateSections(newSections))
      dispatch(resetActiveForm())
    } 

  }, [activeForm, dispatch, sections])
  
  return null
}

export default SectionManager */