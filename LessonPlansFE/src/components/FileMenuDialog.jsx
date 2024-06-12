import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const FileMenuDialog = ({ open, onClose, onSave, title, content, inputLabel, inputValue, setInputValue }) => { // eslint-disable-line react/prop-types
  
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {content}
        {inputLabel && (
          <TextField
            autoFocus
            margin='dense'
            label={inputLabel}
            type='text'
            fullwidth='true'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(inputValue, true)}>Save</Button>
        {title === 'Create New' && (
          <Button onClick={() => onSave(inputValue, false)}>No</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FileMenuDialog

/*OG ChangeTitle
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
*/