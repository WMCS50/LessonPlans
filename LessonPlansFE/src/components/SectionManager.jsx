/* eslint-disable react/prop-types */

import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { addSection, updateSection, deleteSection } from '../features/lessons/sectionsSlice'
import SectionList from './SectionList'

const SectionManager = () => {
  const dispatch = useDispatch()
  const sections = useSelector((state) => state.sections)

  const handleAddSection = () => {
    const newSection = { id: uuidv4(), title: 'New Section', resources: [] }
    dispatch(addSection({ section: newSection }))
  }

  const updateSectionTitle = (sectionId, newTitle) => {
    dispatch(updateSection({ sectionId, title: newTitle }))
  }

  const handleDeleteSection = (sectionId) => {
    dispatch(deleteSection(sectionId))
  }

  return (
    <div>
      <SectionList sections={sections} updateSectionTitle={updateSectionTitle} deleteSection={handleDeleteSection} />
      <button onClick={handleAddSection}>Add Section</button>
    </div>
  )
}

export default SectionManager