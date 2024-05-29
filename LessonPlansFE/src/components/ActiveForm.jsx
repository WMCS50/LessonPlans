import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'
import { addResource } from '../features/lessons/resourcesSlice'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
  
  console.log('active form', activeForm)
  
  useEffect(() => {
    if(activeForm) {
      setOpen(true)
    }
  }, [activeForm])

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddResource = (resource) => {
    dispatch(addResource({ resource, index: activeForm.index }))
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
    default:
      return null
  }
}

export default ActiveForm
