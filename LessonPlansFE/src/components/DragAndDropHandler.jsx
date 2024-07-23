/* eslint-disable react/prop-types */
import { useDispatch } from 'react-redux'
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

const DragAndDropHandler = ({ items, onReorder, children }) => {
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
      dispatch(onReorder({ activeId: active.id, overId: over.id }))
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export default DragAndDropHandler