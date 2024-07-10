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
  const navigate = useNavigate()
  const { id } = useParams()
  const isInPreview = window.location.pathname === '/preview'
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const user = useSelector(state => state.auth.user)
  const [username, setUsername] = useState('null')
  
  useEffect(() => {
    if (!user) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, user])

  // Set username when user data is available
  useEffect(() => {
    if (user) {
    setUsername(user.user.username)  
    }
  }, [user])

  //fetch saved lesson or preview if user data is available
  useEffect(() => {
    if (isInPreview) {
      const lessonPreviewData = localStorage.getItem('lessonPreviewData')
      if (lessonPreviewData) {
        setLesson(JSON.parse(lessonPreviewData))
      } else {
        setError('No preview data available')
      }
    } else if (username && id) {
      const fetchLesson = async () => {
        setIsLoading(true)
        try {
          const response = await axios.get(`http://localhost:3001/lessons/${id}`)
          const lessonData = response.data
          console.log('fetchLesson', lessonData)
          setLesson(lessonData )
          setIsLoading(false)
        } catch (error) {
          setError(error.message)
          setIsLoading(false)
        }
      }
      fetchLesson()
    }
  }, [id, isInPreview, username])
    
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
    if (username && !isInPreview) {
      console.log('preview?', isInPreview)
      console.log('currentUser.name', username)
      console.log('lesson.createdBy', lesson.createdBy)
      if (username === lesson.createdBy) {
        return (
          <button onClick={editLesson} >
          Edit
        </button>)
      }
    }
    return null
  }

  const fileMenuItems = username === lesson.createdBy ? ['Save As New', 'Edit', 'Share'] : ['Save As New']

  return (
    <div className='lesson-read-container'>
      <header className='lesson-read-header'>
        {!isInPreview && (
          <>
            <FileMenuManager 
              currentLesson={lesson} 
              setCurrentLesson={setLesson} 
              resources={resources} 
              sections={lesson.sections}
              fileMenuItems={fileMenuItems} />
          </>
        )}
        <h3>{lesson.title}</h3>
        {renderEditButton()}
        {!isInPreview && (
          <>
            <UserMenu />
          </>
        )}        
      </header>
      <div className='lesson-read-content'>
        {groupedResources.map(section => (
          <div key={section.id} className='section'>
            <h4 className='section-title'>{section.title}</h4>
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


/*prior to popout
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
  const navigate = useNavigate()
  const { id } = useParams()
  const isInPreview = window.location.pathname === '/preview'
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const previewLesson = useSelector(state => state.lessonPreview.lesson)
  const user = useSelector(state => state.auth.user)
  const [username, setUsername] = useState('null')
  
  useEffect(() => {
    if (!user) {
      dispatch(loadUserFromStorage())
    }
  }, [dispatch, user])

  // Set username when user data is available
  useEffect(() => {
    if (user) {
    setUsername(user.user.username)  
    }
  }, [user])

  //fetch saved lesson or preview if user data is available
  useEffect(() => {
    if (username) {
      if (id) {
        console.log('fetching saved lesson with ID', id)
        const fetchLesson = async () => {
          setIsLoading(true)
          try {
            const response = await axios.get(`http://localhost:3001/lessons/${id}`)
            const lessonData = response.data
            console.log('fetchLesson', lessonData)
            setLesson(lessonData )
            setIsLoading(false)
          } catch (error) {
            setError(error.message)
            setIsLoading(false)
          }
        }
        fetchLesson()
      } else {
        console.log('loading preview lesson from state')
        console.log('previewLesson', previewLesson)
        setLesson(previewLesson)
      }
    } 
  }, [id, previewLesson, username])

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
    if (username && !isInPreview) {
      console.log('preview?', isInPreview)
      console.log('currentUser.name', username)
      console.log('lesson.createdBy', lesson.createdBy)
      if (username === lesson.createdBy) {
        return (
          <button onClick={editLesson} >
          Edit
        </button>)
      }
    }
    return null
  }

  const fileMenuItems = username === lesson.createdBy ? ['Save As New', 'Edit', 'Share'] : ['Save As New']

  return (
    <div className='lesson-read-container'>
      <header className='lesson-read-header'>
        {!isInPreview && (
          <>
            <FileMenuManager 
              currentLesson={lesson} 
              setCurrentLesson={setLesson} 
              resources={resources} 
              sections={lesson.sections}
              fileMenuItems={fileMenuItems} />
          </>
        )}
        <h3>{lesson.title}</h3>
        {renderEditButton()}
        {!isInPreview && (
          <>
            <UserMenu />
          </>
        )}        
      </header>
      <div className='lesson-read-content'>
        {groupedResources.map(section => (
          <div key={section.id} className='section'>
            <h4 className='section-title'>{section.title}</h4>
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
*/
