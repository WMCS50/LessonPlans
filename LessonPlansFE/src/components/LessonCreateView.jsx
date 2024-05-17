/* eslint-disable react/prop-types */
import { useState } from 'react'
import axios from 'axios'
import ResponsiveAppBar from './ResponsiveAppBar'
import AddDocument from './AddDocument'
import AddWebsite from './AddWebsite'
import AddVideo from './AddVideo'
import { v4 as uuidv4 } from 'uuid'
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const [resources, setResources] = useState([])
  const [lessonTitle, setLessonTitle] = useState('')
  const [activeForm, setActiveForm] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleAddResource = (newResource) => {
    const resourceWithId = { ...newResource, id: uuidv4() }
    setResources([...resources, resourceWithId])
    console.log('new resource added', resourceWithId)
    setActiveForm(null)
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

  const handleDragEnd = (event) => {
    const {active, over } = event

    if (active.id !== over.id) {
      setResources((resources) => {
        const oldIndex = resources.findIndex(resource => resource.id === active.id)
        const newIndex = resources.findIndex(resource => resource.id === over.id)

        return arrayMove(resources, oldIndex, newIndex)
      })
    }

  }

//SortableItem to refactor
  const SortableItem = ({ id, resource, handleDeleteResource }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id} )

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    
    return (
      <div 
        ref={setNodeRef} style={style} className='resource-item'
        {...attributes} {...listeners}
      >
        <p>Title: {resource.title}</p>
        {resource.times && resource.times.map((time) => (
          <div key={time.id}>
            <p>Start Time: {time.start}</p>
            <p>End Time: {time.end}</p>
          </div>
        ))}
        <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
      </div>
    );
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
        <ResponsiveAppBar setActiveForm={setActiveForm} />
          {activeForm === 'Add Document' && <AddDocument onAddResource={handleAddResource} /> }
          {activeForm === 'Add Website' && <AddWebsite onAddResource={handleAddResource} /> }
          {activeForm === 'Add Video' && <AddVideo onAddResource={handleAddResource} /> }
      </div>
      
      <div className='resource-display'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={resources.map(resource => resource.id)} strategy={verticalListSortingStrategy}>
            <div className='resource-display'>
            {resources.map((resource) => (
              <SortableItem key={resource.id} id={resource.id} resource={resource} handleDeleteResource={handleDeleteResource} />
            ))}
          </div>
          </SortableContext>
        </DndContext>
        <button className='save-lesson-button' onClick={handleSaveLesson}>Save Lesson</button>
      </div>

    </div>
  )
}

export default LessonCreateView