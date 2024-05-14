import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const LessonReadView = () => {
  const { id } = useParams()
  console.log('lesson ID', id)
  const [lesson, setLesson] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
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
  }, [id])
  
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