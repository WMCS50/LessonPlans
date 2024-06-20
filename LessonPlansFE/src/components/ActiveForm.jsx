/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'
import AddText from './AddText'
import { addResource } from '../features/lessons/resourcesSlice'
import { addSection } from '../features/lessons/sectionsSlice'
import { v4 as uuidv4 } from 'uuid'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
  const activeSectionId = useSelector((state) => state.activeSection)
  
  //hook to handle opening form dialogs or adding a section
  useEffect(() => {
    if(activeForm) {
      if (activeForm.type === 'Add Section') {
        const newSection = { id: uuidv4() }
        dispatch(addSection({ section: newSection }))
        dispatch(resetActiveForm())
      } else {
        setOpen(true)
      }
    }
  }, [activeForm, dispatch])

  const handleClose = () => {
    setOpen(false)
    dispatch(resetActiveForm())
  }

  const handleAddResource = (resource) => {
    if (activeSectionId) {
      const sectionId = activeSectionId
      dispatch(addResource({ resource, sectionId }))
    } else {
      window.alert('Select a section to add a resource')
    }
  }
  
  if (!activeForm || activeForm.type === 'Add Section') {
    return null
  }

  const renderDialog = () => {
    switch (activeForm.type) {
      case 'Add Document':
        return <AddDocument open={open} onClose={handleClose} onAddResource={handleAddResource} />
      case 'Add Website':
        return <AddWebsite  open={open} onClose={handleClose} onAddResource={handleAddResource} />
      case 'Add Video':
        return <AddVideo  open={open} onClose={handleClose} onAddResource={handleAddResource} />
      case 'Add Text':
        return <AddText  open={open} onClose={handleClose} onAddResource={handleAddResource} />
      default:
        return null
    }
  }
  
  return renderDialog()
}

export default ActiveForm