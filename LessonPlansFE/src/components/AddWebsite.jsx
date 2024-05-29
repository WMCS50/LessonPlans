import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField} from '@mui/material'

const AddWebsite = ({ open, onClose, onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  
  const dispatch = useDispatch()

  const handleAdd = () => {
    onAddResource({
      type: 'website',
      title,
      link
    })
    setTitle('')
    setLink('')
    dispatch(resetActiveForm())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Website</DialogTitle>
      <DialogContent>
        <TextField 
          autoFocus
          margin='dense'
          label="Enter title for website"
          type='text'
          fullwidth='true'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          autoFocus
          margin='dense'
          label="Enter website link"
          type='text'
          fullwidth='true'
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddWebsite