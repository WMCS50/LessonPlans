import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../../features/lessons/activeFormSlice'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import TextEditor from '../TextEditor'

const AddText = ({ open, onClose, onAddResource }) => { // eslint-disable-line react/prop-types

  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const dispatch = useDispatch()

  const handleContentChange = (content, editor) => {
    const htmlContent = editor.getContent(content)
    setContent(htmlContent)
  }

  const handleAdd = async () => {
    onAddResource({
      type: 'text',
      title,
      content
    })
    setTitle('')
    setContent('')
    dispatch(resetActiveForm())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Text</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Enter text title'
          type='text'
          fullwidth='true'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      <TextEditor initialValue={''} onContentChange={handleContentChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddText