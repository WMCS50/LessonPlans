/* eslint-disable react/prop-types */
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addSection, updateSections } from '../features/lessons/sectionsSlice'
import { v4 as uuidv4 } from 'uuid'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const SectionManager = ({ activeForm, sections }) => {
  const dispatch = useDispatch()

  useEffect(() => {
    if (activeForm && activeForm.type === 'Add Section') {
      const newSection = { id: uuidv4() }
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

export default SectionManager