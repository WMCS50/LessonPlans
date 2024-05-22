/* eslint-disable react/prop-types */
import { useSortable,} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

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

export default SortableItem