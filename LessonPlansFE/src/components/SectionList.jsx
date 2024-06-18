/* eslint-disable react/prop-types */

import { useDispatch } from 'react-redux'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { reorderSections } from '../features/lessons/sectionsSlice'
import './SectionList.css'
import SortableSection from './SortableSection'

const SectionList = ({ sections = [], updateSectionTitle, deleteSection } ) => {
  const dispatch = useDispatch()

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

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} >
        <SortableContext items={sections.map(section => section.id)} strategy={verticalListSortingStrategy}>
          <div>
            {sections.map((section) => (
              <SortableSection key={section.id} id={section.id} 
                section={section} 
                updateSectionTitle={updateSectionTitle}
                deleteSection={deleteSection} 
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default SectionList