/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import { updateResource } from '../features/lessons/resourcesSlice'

const AddResource = ({ open, onClose, onAddResource, resource, type }) => {
  const [title, setTitle] = useState(resource?.title || '')
  const [link, setLink] = useState(resource?.link || '')
  const [startTime, setStartTime] = useState(resource?.startTime || '')
  const [endTime, setEndTime] = useState(resource?.endTime || '')
  const dispatch = useDispatch()

  useEffect(() => {
    if (resource) {
      setTitle(resource.title)
      setLink(resource.link)
      setStartTime(resource.startTime)
      setEndTime(resource.endTime)
    }
  }, [resource])

  const handleAdd = () => {
    const newResource = {
      ...resource,
      type,
      title,
      link,
      startTime,
      endTime
    }
  

    if (resource) {
      dispatch(updateResource({ resourceId: resource.id, ...newResource}))
    } else {
      onAddResource(newResource)
    }

    setTitle('')
    setLink('')
    setStartTime('')
    setEndTime('')
    dispatch(resetActiveForm())
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{resource ? 'Edit' : 'Add'} {type.charAt(0).toUpperCase() + type.slice(1)}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label={`${type.charAt(0).toUpperCase() + type.slice(1)} Title`}
          type='text'
          fullwidth='true'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {type !== 'text' && 
          <TextField
            autoFocus
            margin='dense'
            label={`${type.charAt(0).toUpperCase() + type.slice(1)} Link`}
            type='text'
            fullwidth='true'
            value={link}
            onChange={(e) => setLink(e.target.value)}
        
          />
        }
        {type === 'video' && (
          <>
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
          </>
        )}
      </DialogContent>
      <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>{resource ? 'Save' : 'Add'}</Button>
        </DialogActions>
    </Dialog>
  )

}




export default AddResource