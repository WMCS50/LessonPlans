import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { loadUserFromStorage } from '../features/auth/authSlice'
import { useQuery } from '@apollo/client'
import { GET_LESSON } from '../queries'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import './LessonList.css'

const LessonReadView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const isInPreview = window.location.pathname === '/preview'
  const [lesson, setLesson] = useState(null)
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
    setUsername(user.username)  
    }
  }, [user])

  const { data, error } = useQuery(GET_LESSON, {
    variables: { id },
    skip: isInPreview || !user,
  })

  useEffect(() => {
    if (data) {
      setLesson(data.lesson)
    }
  }, [data])

  //fetch saved lesson or preview if user data is available
  useEffect(() => {
    if (isInPreview) {
      const lessonPreviewData = localStorage.getItem('lessonPreviewData')
      if (lessonPreviewData) {
        setLesson(JSON.parse(lessonPreviewData))
      } else {
        setLesson(null)
      }
    } 
  }, [isInPreview])
    
  if (error) return <div>Error: {error} </div>
  if (!lesson) return <div>No lesson found</div>

  const editLesson = () => {
    navigate(`/create/${id}`)
  }
  console.log('data.lesson', data.lesson)
  console.log('lesson.resources', lesson.resources)

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