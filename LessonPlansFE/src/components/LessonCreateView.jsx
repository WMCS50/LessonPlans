/* eslint-disable react/prop-types */

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import axios from 'axios'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import ResourceList from './ResourceList'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      resources: []
    })
  
    const fileMenuItems = ['Save', 'Save As New','Create New', 'Open', 'Share']

//Resets title and resources when creating a new lesson
  useEffect(() => {
    dispatch(resetResources())
    if (!id) {
      setCurrentLesson({
        id: null,
        title: '',
        resources: []
      })
    }
  }, [dispatch, id])

//Fetches existing lesson data if navigated to from read view.
  useEffect(() => {
    if (id) {
      const fetchLesson = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/lessons/${id}`)
          const lessonData = response.data
          setCurrentLesson (lessonData)
          dispatch(updateResources(lessonData.resources))
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
      fetchLesson()
    }
  }, [id, dispatch])

  //allows for input of lesson title
  const LessonTitleInput = ({ currentLesson, setCurrentLesson }) => {
    return (
      <input 
        className='lesson-title-input'
        type='text'
        placeholder='Enter Lesson Title'
        value={currentLesson.title}
        onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value})}
      />
    )
  }

  return (
    <div className='lesson-create-view' >
      <div className='above-app-bar'>
        <FileMenuManager 
          currentLesson={currentLesson} 
          setCurrentLesson={setCurrentLesson} 
          resources={resources}
          fileMenuItems={fileMenuItems} 
        />
        <LessonTitleInput currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
        <UserMenu className='user-menu'/>
      </div>
      <div className='app-bar'>
        <ResponsiveAppBar className='responsive-app-bar'
          setActiveForm={(form) => dispatch(setActiveForm(form))}
          resourcesLength={resources.length} />
        <ActiveForm />
      </div>
      <div >
        <ResourceList />
      </div>
    </div>
  )
}

export default LessonCreateView