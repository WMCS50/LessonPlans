import { useState } from 'react'
import axios from 'axios'
import AddResource from './AddResource'
import { v4 as uuidv4 } from 'uuid'
import './LessonCreateView.css'

  const LessonCreateView = () => {
  const [resources, setResources] = useState([])
  const [lessonTitle, setLessonTitle] = useState('')

  const handleAddResource = (newResource) => {
    const resourceWithId = { ...newResource, id: uuidv4() }
    setResources([...resources, resourceWithId])
    console.log('new resource added', resourceWithId)
  }

  const handleSaveLesson = async () => {
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

  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter(resource => resource.id !== resourceId)
    setResources(updatedResources)
    alert('Resource deleted')
  }

  console.log('current state of resources', resources)

  return (
    <div className='lesson-create-view'>
      <div className='toolbar'>
        <input 
          type='text'
          placeholder='Enter Lesson Title'
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <AddResource onAddResource={handleAddResource} />
      </div>
      
      <div className='resource-display'>
        {resources.map((resource, index) => (
          <div key={resource.id} className='resource-item'>
            <p>Type: {resource.type}</p>
            <p>Link: {resource.link}</p>
            {resource.times && resource.times.map((time, idx) => (
              <div key={idx}>
                <p>Start Time: {time.start}</p>
                <p>End Time: {time.end}</p>
              </div>
            ))}
            <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
          </div>
        ))}      
        <button className='save-lesson-button' onClick={handleSaveLesson}>Save Lesson</button>
      </div>
    </div>
  )
}

export default LessonCreateView

/*
import { useState } from 'react'
import axios from 'axios'
import AddResource from './AddResource'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { v4 as uuidv4 } from 'uuid'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const [resources, setResources] = useState([])
  const [lessonTitle, setLessonTitle] = useState('')

  const handleAddResource = (newResource) => {
    const resourceWithId = { ...newResource, id: uuidv4() }
    setResources([...resources, resourceWithId])
    console.log('new resource added', resourceWithId)
  }

  const handleSaveLesson = async () => {
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

  const handleDeleteResource = (resourceId) => {
    const updatedResources = resources.filter(resource => resource.id !== resourceId)
    setResources(updatedResources)
    alert('Resource deleted')
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const items = Array.from(resources)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setResources(items)
  }

  console.log('current state of resources', resources)

  return (
    <div className='lesson-create-view'>
      <div className='toolbar'>
        <input 
          type='text'
          placeholder='Enter Lesson Title'
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <AddResource onAddResource={handleAddResource} />
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='resources'>
          {(provided) => (
            <div className='resource-display'
              {...provided.droppableProps} ref={provided.innerRef}>
                {resources.map((resource, index) => (
                  <Draggable key={resource.id} draggableId={`resource-${resource.id}`} index={index}>  
                    {(provided) => (
                      <div 
                        className='resource-item'
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <p>Type: {resource.type}</p>
                        <p>Link: {resource.link}</p>
                        {resource.times && resource.times.map((time, idx) => (
                          <div key={idx}>
                            <p>Start Time: {time.start}</p>
                            <p>End Time: {time.end}</p>
                          </div>
                        ))}
                        <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
                      </div>
                  )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <button className='save-lesson-button' onClick={handleSaveLesson}>Save Lesson</button>
    </div>
  )
}

export default LessonCreateView
*/