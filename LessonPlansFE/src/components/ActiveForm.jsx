import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AddEditResource from './AddEditResource'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import SectionManager from './SectionManager'

const ActiveForm = () => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const activeForm = useSelector((state) => state.activeForm)
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
        />
      )}
    </>
  )
}

export default ActiveForm