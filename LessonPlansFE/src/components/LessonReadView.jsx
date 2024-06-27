import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { loadUserFromStorage } from '../features/auth/authSlice'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import axios from 'axios'
import './LessonList.css'

const LessonReadView = () => {
  const dispatch = useDispatch()
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const previewLesson = useSelector(state => state.lessonPreview)
  const user = useSelector(state => state.auth.user)
  const [userId, setUserId] = useState('null')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, user])

  // Set userId when user data is available
  useEffect(() => {
    if (user) {
      setUserId(user.user.id)
    }
  }, [user])

  //fetch saved lesson or preview if user data is available
  useEffect(() => {
    if (userId) {
      if (id) {
        console.log('fetching saved lesson with ID', id)
        const fetchLesson = async () => {
          setIsLoading(true)
          try {
            const response = await axios.get(`http://localhost:3001/lessons/${id}`)
            console.log('fetchLesson', response.data)
            setLesson(response.data)
            setIsLoading(false)
          } catch (error) {
            setError(error.message)
            setIsLoading(false)
          }
        }
        fetchLesson()
      } else {
        console.log('loading preview lesson from state')
        setLesson(previewLesson)
      }
    } 
  }, [id, previewLesson, userId])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error} </div>
  if (!lesson) return <div>No lesson found</div>

  const editLesson = () => {
    navigate(`/create/${id}`)
  }

  const resources = lesson.resources
  const groupedResources = lesson.sections.map(section => {
    return {
      ...section,
      resources: lesson.resources.filter(resource => resource.sectionId === section.id)
    }
  })

  const renderEditButton = () => {
    if (userId) {
      console.log('currentUser.id', userId)
      console.log('lesson.creatorId', lesson.createdBy)
      if (userId === lesson.createdBy) {
        return (
          <button onClick={editLesson} >
          Edit
        </button>)
      }
    }
    return null
  }

  const fileMenuItems = userId === lesson.createdBy ? ['Save As New', 'Edit'] : ['Save As New']

  return (
    <div className='lesson-read-container'>
      <header className='lesson-read-header'>
        <FileMenuManager 
          currentLesson={lesson} 
          setCurrentLesson={setLesson} 
          resources={resources} 
          fileMenuItems={fileMenuItems} />
        <h3>{lesson.title}</h3>
        {renderEditButton()}
        <UserMenu />
      </header>
      <div className='lesson-read-content'>
        {groupedResources.map(section => (
          <div key={section.id} className='section'>
            <h4>{section.title}</h4>
            {section.resources.map(resource => {
              switch (resource.type) {
                case 'text':  
                  return <TextDisplay key={resource.id} resource={resource} readOnly={true} />
                case 'document':
                  return <DocumentDisplay key={resource.id} title={resource.title} link={resource.link} />
                case 'website': 
                  return <WebsiteDisplay key={resource.id} title={resource.title} link={resource.link} />
                case 'video':
                  return <VideoDisplay key={resource.id}
                    title={resource.title} link={resource.link} 
                    startTime={resource.startTime} endTime={resource.endTime}/>
                default:
                  return <p key={resource.id}>Unknown resource type</p>
              }
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LessonReadView
