/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { shareLesson } from '../features/lessons/lessonsSlice'
import { Modal, Button, List, ListItem, Checkbox, Box } from '@mui/material';
import './ShareLessonModal.css'

const ShareLessonModal = ({ lessonId, open, onClose }) => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])

  // will change with backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };
    fetchUsers();
  }, []);

  //confirms fetch users worked
  useEffect(() => {
    console.log('show users', users)
  }, [users])

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
  );
};

export default ShareLessonModal
