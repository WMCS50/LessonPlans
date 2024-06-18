/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

const SortableSection = ({ id, section, updateSectionTitle, deleteSection }) => {
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
    <div ref={setNodeRef} style={style} className='section-item' {...attributes} {...listeners} >
      <input
        className='section-title-input'
        type='text'
        value={section.title}
        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
      />
      <div>
        {section.title} 
        {section.id}
      </div>
      <button onClick={() => deleteSection(section.id)}>Delete Section</button>

 </div>
  );
}

export default SortableSection