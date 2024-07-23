/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux'
import { reorderResources } from '../features/lessons/resourcesSlice'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const DragAndDropHandler = ({ sectionResources, sectionId, children }) => {
  const dispatch = useDispatch()
  
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 5
    }
  })
  //console.log('PointerSensor activated:', pointerSensor);
  const sensors = useSensors(pointerSensor)

  const handleDragEnd = (event) => {
    const { active, over } = event
    console.log('active', active)
    console.log('over', over)
    if (active.id !== over.id) {
      dispatch(reorderResources({ activeId: active.id, overId: over.id, sectionId }))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sectionResources.map(resource => resource.id)} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default DragAndDropHandler