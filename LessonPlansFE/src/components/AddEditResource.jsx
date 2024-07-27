import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material'
import { resetActiveForm } from '../features/lessons/activeFormSlice'
import { updateResource, addResource } from '../features/lessons/resourcesSlice'
import { fetchLesson } from '../features/lessons/lessonsSlice'

const AddEditResource = ({ open, onClose, lessonId }) => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [content, setContent] = useState('')
  const activeForm = useSelector((state) => state.activeForm)
  const activeSectionId = useSelector((state) => state.activeSection)
  const { resource, type: formType, index } = activeForm || {}
  const type = formType ? formType.replace('Add ', '').toLowerCase() : ''
  const sectionId = activeSectionId

  useEffect(() => {
    if (resource) {
      setTitle(resource.title || '')
      setLink(resource.link || '')
      setStartTime(resource.startTime || '')
      setEndTime(resource.endTime || '')
      setContent(resource.content || '')
    }
  }, [resource])

  const handleSave = async () => {
    if (!sectionId) {
      alert('Please select a section before adding a resource.')
      return
    }

    const newResource = {
      ...resource,
      type,
      title,
      link,
      startTime,
      endTime,
      sectionId,
      content
    }

    if (resource) {
      dispatch(updateResource({ resourceId: resource.id, ...newResource }))
    } else {
      dispatch(addResource({ resource: newResource, sectionId, index }))
    }
    await dispatch(fetchLesson(lessonId))
    setTitle('')
    setLink('')
    setStartTime('')
    setEndTime('')
    setContent('')
    dispatch(resetActiveForm())
    onClose()
  }

  const handleDialogClose = () => {
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
        {type === 'picture' && (
          <>
            <TextField
              autoFocus
              margin='dense'
              label="Caption"
              type='text'
              fullwidth='true'
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </>
        )}
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
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button onClick={handleSave}>{resource ? 'Save' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEditResource