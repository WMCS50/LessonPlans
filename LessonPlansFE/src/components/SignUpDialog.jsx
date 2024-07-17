/* eslint-disable react/prop-types */
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, MenuItem } from '@mui/material'
import { useMutation } from '@apollo/client'
import { ADD_USER } from '../queries'

const roles = ['teacher', 'substitute', 'admin']

const SignUpDialog = ({ open, onClose }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [addUser] = useMutation(ADD_USER)
  
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      console.log('Attempting to add user:', { username, password, role });
      const { data } = await addUser({ variables: { username, password, role } });
      console.log('Add user response:', data);
      
      alert('Sign up successful')
      handleClose()
    } catch (error) {
      const errorMessage = error.graphQLErrors?.[0]?.message || 'Sign up error. Please try again.'
      console.log(errorMessage)
      alert(errorMessage)
    }
  }

  const handleClose = () => {
    setUsername('')
    setPassword('')
    setRole('')
    onClose()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              margin='dense'
              label='Username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              autoFocus
              margin='dense'
              label='Password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              autoFocus
              margin='dense'
              label='Role'
              select
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              sx={{
                minWidth: 150,
              }}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Sign Up</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SignUpDialog