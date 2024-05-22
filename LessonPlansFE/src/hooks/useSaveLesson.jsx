import axios from 'axios'

export const useSaveLesson = () => {
  
  const handleSaveLesson = async (lessonTitle, resources) => {
    if (!lessonTitle || resources.length === 0) {
      alert('Please add a title and at least one resource before saving')
      return
    }
    try {
      const response = await axios.post('http://localhost:3001/lessons', {
        title: lessonTitle,
        resources: resources
      })
      console.log('lesson saved', response.data)
      alert('Lesson saved')
    } catch (error) {
      console.error('Error in saving lesson', error)
      alert('Lesson did not save')
    }
  }
  return { handleSaveLesson }
}

