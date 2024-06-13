/* eslint-disable react/prop-types */
//Allows for diplaying LessonList inside a Dialog

import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material'
import LessonList from './LessonList'

const LessonListDialog = ({ open, onClose, onSelect }) => { // eslint-disable-line react/prop-types

  const handleLessonSelect = (lesson) => {
    onSelect(lesson)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Select a Lesson to Open</DialogTitle>
      <DialogContent>
        <LessonList onSelect={handleLessonSelect} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default LessonListDialog