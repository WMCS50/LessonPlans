import { useState } from 'react'
import AddResource from './AddResource'
import { useNavigate } from 'react-router-dom'

const LessonCreateView = () => {
  const [lessonTitle, setLessonTitle] = useState('')
  const [resources, setResources] = useState([])
  const navigate = useNavigate()  

  const handlePreviewLesson = () => {
    navigate('/lesson-preview', { state: { title: lessonTitle, resource: resources }})
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
      <AddResource setResources={setResources}/>
      <button onClick={handlePreviewLesson}>Preview Lesson</button>
    </div>
  )
}

export default LessonCreateView