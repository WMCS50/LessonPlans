import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import axios from 'axios'

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

  return (
    <div>
      <h1>{lesson.title}</h1>
      <p>{lesson.content}</p>
    </div>
  )
}

export default LessonReadView
