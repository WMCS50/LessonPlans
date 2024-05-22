/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { reorderResources, deleteResource } from '../features/lessons/resourcesSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import SortableItem from './SortableItem'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSaveLesson } from '../hooks/useSaveLesson'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const [lessonTitle, setLessonTitle] = useState('')
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const { handleSaveLesson } = useSaveLesson()
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      dispatch(reorderResources({ activeId: active.id, overId: over.id}));
    }
  };

  console.log('current state of resources', resources)

  return (
    <div className='lesson-create-view'>
      <div className='toolbar'>
        <input 
          className='lesson-title-input'
          type='text'
          placeholder='Enter Lesson Title'
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
        />
        <button 
          className='save-lesson-button' 
          onClick={() => handleSaveLesson(lessonTitle, resources)}>Save Lesson
        </button>
        <ResponsiveAppBar setActiveForm={(form) => dispatch(setActiveForm(form))} />
        <ActiveForm />
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
              <SortableItem 
                key={resource.id} 
                id={resource.id} 
                resource={resource} 
                handleDeleteResource={(id) => dispatch(deleteResource(id))} />
            ))}
          </div>
          </SortableContext>
        </DndContext>

      </div>

    </div>
  )
}

export default LessonCreateView