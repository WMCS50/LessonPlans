/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from 'react-redux'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { reorderSections } from '../features/lessons/sectionsSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import SortableSection from './SortableSection'

const SectionList = () => {
  const dispatch = useDispatch()
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)

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

/* first crack at gql
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

export default SectionList */