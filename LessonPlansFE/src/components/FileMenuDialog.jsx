/* eslint-disable react/prop-types */

import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

const FileMenuDialog = ({ 
  open, onClose, onSave, 
  title, content, 
  inputLabel, inputValue, setInputValue, 
  showNoOption }) => {
  
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
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSave(inputValue, true)}>Save</Button>
        {showNoOption && (
          <Button onClick={() => onSave(inputValue, false)}>No</Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default FileMenuDialog