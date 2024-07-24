/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { shareLesson } from '../features/lessons/lessonsSlice'
import { useQuery } from '@apollo/client'
import { Modal, Button, List, ListItem, Checkbox, Box } from '@mui/material';
import './ShareLessonModal.css'
import { GET_USERS } from '../queries'

const ShareLessonModal = ({ lessonId, open, onClose }) => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  const { data } = useQuery(GET_USERS)
  console.log('get_users data', data)
  
  useEffect(() => {
    if (data) {
      const usersData = data.users
      try {
        console.log('users', usersData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
  }, [data])

  const handleUserToggle = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    )
  }

  const handleShare = () => {
    dispatch(shareLesson({ lessonId, users: selectedUsers }))
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='modal-content'>
        <h2>Share Lesson</h2>
        <p>Select from the following users</p>
        <List>
          {users.map((user) => (
            <ListItem key={user.id}>
              <Checkbox
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleUserToggle(user.id)}
              />
              {user.username}
            </ListItem>
          ))}
        </List>
        <Button onClick={handleShare}>Share</Button>
        <Button onClick={onClose}>Cancel</Button>
      </Box>
    </Modal>
  )
}

export default ShareLessonModal
