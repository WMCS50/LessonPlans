import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditResource from './AddEditResource'
import { addResource } from '../features/lessons/resourcesSlice'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import SectionManager from './SectionManager'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
  const activeSectionId = useSelector((state) => state.activeSection)
  const sections = useSelector((state) => state.sections)
  
  //hook to handle opening form dialogs or adding a section
  useEffect(() => {
    if (activeForm && activeForm.type !== 'Add Section') {
      setOpen(true)
    }
  }, [activeForm])

  const handleClose = () => {
    setOpen(false)
    dispatch(resetActiveForm())
  }

  const handleAddResource = (resource) => {
    if (activeSectionId) {
      dispatch(addResource({ resource, sectionId: activeSectionId }))
    } else {
      window.alert('Select a section to add a resource')
    }
  }
  
  if (!activeForm) {
    return null
  }

  return (
    <>
      <SectionManager activeForm={activeForm} sections={sections} />
      {activeForm.type !== 'Add Section' && (
        <AddEditResource 
          open={open}
          onClose={handleClose}
          onAddResource={handleAddResource}
          resource={null}
          type={activeForm.type.replace('Add ', '').toLowerCase()}
          sectionId={activeSectionId}
        />
      )}
    </>
  )
}

export default ActiveForm


/* import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditResource from './AddEditResource'
import { addResource } from '../features/lessons/resourcesSlice'
import { addSection, updateSections } from '../features/lessons/sectionsSlice'
import { v4 as uuidv4 } from 'uuid'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
  const activeSectionId = useSelector((state) => state.activeSection)
  const sections = useSelector((state) => state.sections)
  
  //hook to handle opening form dialogs or adding a section
  useEffect(() => {
    if (activeForm) {
      if (activeForm.type === 'Add Section') {
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
      } else {
        setOpen(true)
      } 
    }
  }, [activeForm, dispatch, sections])

  const handleClose = () => {
    setOpen(false)
    dispatch(resetActiveForm())
  }

  const handleAddResource = (resource) => {
    if (activeSectionId) {
      dispatch(addResource({ resource, sectionId: activeSectionId }))
    } else {
      window.alert('Select a section to add a resource')
    }
  }
  
  if (!activeForm || activeForm.type === 'Add Section') {
    return null
  }

    return (
      <AddEditResource 
        open={open}
        onClose={handleClose}
        onAddResource={handleAddResource}
        resource={null}
        type={activeForm.type.replace('Add ', '').toLowerCase()}
        sectionId={activeSectionId}
      />
    )
}

export default ActiveForm */