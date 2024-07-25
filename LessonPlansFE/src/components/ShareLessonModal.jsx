/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useQuery, useMutation } from '@apollo/client'
import { Modal, Button, List, ListItem, Checkbox, Box } from '@mui/material';
import './ShareLessonModal.css'
import { GET_USERS, GET_LESSON, SHARE_LESSON } from '../queries'

const ShareLessonModal = ({ lessonId, open, onClose }) => {
  const [selectedUsers, setSelectedUsers] = useState([])
  const currentUser = useSelector((state) => state.auth.user)
  const [shareLesson] = useMutation(SHARE_LESSON, {
    refetchQueries: [{ query: GET_LESSON, variables: { id: lessonId } }]
  })
  const { data: usersData } = useQuery(GET_USERS)
  const { data: lessonData } = useQuery(GET_LESSON, { variables: { id: lessonId } })

  useEffect(() => {
    if (lessonData && lessonData.lesson.sharedWith) {
      setSelectedUsers(lessonData.lesson.sharedWith.map(user => user.id))
    }
  }, [lessonData])

  const handleUserToggle = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    )
  }

  const handleShare = async () => {
    try {
      await shareLesson({ 
        variables: {
          id: lessonId,
          users: selectedUsers
        }
      })
      alert('Lesson shared successfully')
      onClose()
    } catch (error) {
      console.error('Error sharing lesson', error)
      alert('Error sharing lesson')
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box className='modal-content'>
        <h2>Share Lesson</h2>
        <p>Select from the following users</p>
        <List>
          {usersData && usersData.users
            .filter(user => user.username !== currentUser.username)
            .map((user) => (
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
