import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'
import AddText from './AddText'
import { addResource } from '../features/lessons/resourcesSlice'
import { resetActiveForm } from '../features/lessons/activeFormSlice'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
  const sections = useSelector((state) => state.sections)
  
  useEffect(() => {
    if(activeForm) {
      setOpen(true)
    }
  }, [activeForm])

  const handleClose = () => {
    setOpen(false)
    dispatch(resetActiveForm())
  }

  const handleAddResource = (resource) => {
    const sectionId = activeForm.sectionId || (sections.length > 0 ? sections[0].id : null)
    if (sectionId) {
      dispatch(addResource({ resource, sectionId }))
    }

  }

  if (!activeForm) {
    return null
  }

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

export default ActiveForm
