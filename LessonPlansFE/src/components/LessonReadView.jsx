import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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

  console.log('lesson content', lesson.resources)
  const resources = lesson.resources

  return (
    <div className='lesson-read-container'>
      <header className='lesson-read-header'>
        <SchoolIcon sx={{ width: 50, height: 50, color: green[900] }} />
        <h1>{lesson.title}</h1>
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
              return <p key ={resource.id}>Unknown resource type</p>
          }
        })}
      </div>
    </div>
  )
}

export default LessonReadView
