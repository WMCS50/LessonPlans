import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const ChangeTitle = ({ open, onClose, onSave }) => { // eslint-disable-line react/prop-types
  const [newTitle, setNewTitle] = useState('')
  
  const handleSave = () => {
    onSave(newTitle)
    setNewTitle('')
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>New Lesson Title</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='New Lesson Title'
          type='text'
          fullwidth='true'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ChangeTitle