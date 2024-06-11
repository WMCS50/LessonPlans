import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import TextDisplay from './TextDisplay'
import DocumentDisplay from './DocumentDisplay'
import WebsiteDisplay from './WebsiteDisplay'
import VideoDisplay from './VideoDisplay'
import UserMenu from './UserMenu'
import axios from 'axios'
import SchoolIcon from '@mui/icons-material/School'
import { green } from '@mui/material/colors'
import './LessonList.css'

const LessonReadView = () => {
  const { id } = useParams()
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const previewLesson = useSelector(state => state.lessonPreview)
  const currentUser = useSelector((state) => state.auth.user)
  const navigate = useNavigate()

  useEffect(() => {
    //if there's an id in the URL, then we will fetch a saved lesson;
    //otherewise we'll fetch a preview lesson from the store   
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
  }, [id, previewLesson])
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error} </div>
  if (!lesson) return <div>No lesson found</div>

  const editLesson = () => {
    console.log({id})
    navigate(`/create/${id}`)
  }


  console.log('lesson content', lesson.resources)
  const resources = lesson.resources

  const renderEditButton = () => {
    console.log('currentUser.id', currentUser.user.id)
    console.log('lesson.creatorId', lesson.createdBy)
    //this needs to change when backend setup correctly
    //in terms of user and creator ids
    if (currentUser) {
      if (currentUser.user.id === lesson.createdBy) {
        return (
          <button onClick={editLesson} className='edit-lesson-button'>
          Edit
        </button>)
      }
    }
    return null
  }

  return (
    <div className='lesson-read-container'>
      <header className='lesson-read-header'>
        <SchoolIcon sx={{ width: 50, height: 50, color: green[900] }} />
        <h3>{lesson.title}</h3>
        {renderEditButton()}
{/*         {currentUser && currentUser.id === lesson.creatorId && (
        <button onClick={editLesson} className='edit-lesson-button'>
          Edit
        </button>)} */}
        <UserMenu />
      </header>
      <div className='lesson-read-content'>      
        {resources.map((resource) => {
          switch (resource.type) {
            case 'text':  
              return <TextDisplay key={resource.id} title={resource.title} content={resource.content} />
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
    </div>
  )
}

export default LessonReadView
