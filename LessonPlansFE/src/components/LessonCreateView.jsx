import { useState } from 'react'
import AddResource from './AddResource'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPreviewLesson } from '../features/lessons/lessonPreviewSlice'
import axios from 'axios'

const LessonCreateView = () => {
  const [lessonTitle, setLessonTitle] = useState('')
  const [resources, setResources] = useState([])
  const dispatch = useDispatch()  
  const navigate = useNavigate()
  
  const handleAddResource = (newResource) => {
    setResources([...resources, newResource])
  }

  const handleSaveLesson = async () => {
    try {
      const response = await axios.post('http://localhost:3001/lessons', {
        title: lessonTitle,
        resources: resources
      })
      console.log('lesson saved', response.data)
    } catch (error) {
      console.error('Error saving the lesson', error)
    }
  }

  const handleSavePreview = () => {
    const lessonData = {
      title: lessonTitle,
      content: 'some content here' //to fill out later
    }
    dispatch(setPreviewLesson(lessonData))
  }

  const handlePreview = () => {
    handleSavePreview()
    navigate('/lesson-preview')
  }

  return (
    <div>
      <h1>Create Lesson View</h1>
      <input 
        type='text'
        placeholder='Enter Lesson Title'
        value={lessonTitle}
        onChange={(e) => setLessonTitle(e.target.value)}
      />
      <AddResource onAddResource={handleAddResource}/>
      <button onClick={handlePreview}>Preview Lesson</button>
      <button onClick={handleSaveLesson}>Save Lesson</button>
    </div>
  )
}

export default LessonCreateView

/*
import { useState } from 'react'
import AddResource from './AddResource'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setPreviewLesson } from '../features/lessons/lessonPreviewSlice'
import axios from 'axios'

const LessonCreateView = () => {
  const [lessonTitle, setLessonTitle] = useState('')
  const [resources, setResources] = useState([])
  const dispatch = useDispatch()  
  const navigate = useNavigate()
  
  const handleAddResource = (newResource) => {
    setResources([...resources, newResource])
  }

  const handleSaveLesson = async () => {
    try {
      const response = await axios.post('http://localhost:3001/lessons', {
        title: lessonTitle,
        resources: resources
      })
      console.log('lesson saved', response.data)
    } catch (error) {
      console.error('Error saving the lesson', error)
    }
  }

  const handleSavePreview = () => {
    const lessonData = {
      title: lessonTitle,
      content: 'some content here' //to fill out later
    }
    dispatch(setPreviewLesson(lessonData))
  }

  const handlePreview = () => {
    handleSavePreview()
    navigate('/lesson-preview')
  }

  return (
    <div>
      <h1>Create Lesson View</h1>
      <input 
        type='text'
        placeholder='Enter Lesson Title'
        value={lessonTitle}
        onChange={(e) => setLessonTitle(e.target.value)}
      />
      <AddResource onAddResource={handleAddResource}/>
      <button onClick={handlePreview}>Preview Lesson</button>
      <button onClick={handleSaveLesson}>Save Lesson</button>
    </div>
  )
}

export default LessonCreateView
*/