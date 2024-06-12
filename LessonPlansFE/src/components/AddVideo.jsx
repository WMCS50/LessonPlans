import { useState } from 'react';
import { useDispatch } from 'react-redux'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField} from '@mui/material'
import VideoDisplay from './VideoDisplay'

const AddVideo = ({ open, onClose, onAddResource }) => { // eslint-disable-line react/prop-types
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const dispatch = useDispatch()

  const handleAdd = () => {
    onAddResource({
      type: 'video',
      title,
      link,
      startTime,
      endTime
    })
    setTitle('')
    setLink('')
    setStartTime('')
    setEndTime('')

    dispatch(resetActiveForm())
    onClose()
    }

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Add Video</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            label='Enter video title'
            type='text'
            fullwidth='true'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            autoFocus
            margin='dense'
            label='Enter Youtube link'
            type='text'
            fullwidth='true'
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
           <TextField
            autoFocus
            margin='dense'
            label="Start time (s)"
            type='text'
            fullwidth='true'
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
          />
           <TextField
            autoFocus
            margin='dense'
            label="End time (s)"
            type='text'
            fullwidth='true'
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
        {link && <VideoDisplay title={title} link={link}/>}
      </Dialog>
    )
}

export default AddVideo