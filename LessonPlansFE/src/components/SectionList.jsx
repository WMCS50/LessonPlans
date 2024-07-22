/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { reorderSections } from '../features/lessons/sectionsSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import SortableSection from './SortableSection'
import { useEffect } from 'react'

const SectionList = () => {
  const dispatch = useDispatch()
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)

  useEffect(() => {
    console.log('sections:', sections)
  }, [sections])

  
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
 
  const sensors = useSensors(pointerSensor)

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      dispatch(reorderSections({ activeId: active.id, overId: over.id}))
    }
  }

  const handleSectionClick = (sectionId) => {
    console.log('sectionid', sectionId)
    dispatch(setActiveSection(sectionId))
  }
  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
        <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
          <div>
            {sections.map((section) => (
              <SortableSection 
                key={section.id} 
                section={section} 
                isActive={activeSectionId === section.id}
                onClick={() => handleSectionClick(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default SectionList

/* too much gql? 
import { useDispatch, useSelector } from 'react-redux'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { reorderSections } from '../features/lessons/sectionsSlice'
import { setActiveSection  } from '../features/lessons/activeSectionSlice'
import { useQuery } from '@apollo/client'
import { GET_SECTIONS } from '../queries'
import SortableSection from './SortableSection'

const SectionList = ({ currentLesson }) => {
  const dispatch = useDispatch()
  const sections = useSelector((state => state.sections))
  const activeSectionId = useSelector((state) => state.activeSection)

  //Fetch sections from current lesson
  const { data, loading, error } = useQuery(GET_SECTIONS, { 
    variables: { lessonId: currentLesson.id },
    skip: !currentLesson.id
  })
console.log('sections', sections)
   const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
 
  const sensors = useSensors(pointerSensor)

  //Handles the drag-drop of sections  
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      dispatch(reorderSections({ activeId: active.id, overId: over.id}))
    }
  }

  const handleSectionClick = (sectionId) => {
    dispatch(setActiveSection(sectionId))
  }

  if (loading) return <p>Loading sections...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
        <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
          <div>
            {sections.map((section) => (
              <SortableSection 
                key={section.id} 
                section={section} 
                isActive={activeSectionId === section.id}
                onClick={() => handleSectionClick(section.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default SectionList */



