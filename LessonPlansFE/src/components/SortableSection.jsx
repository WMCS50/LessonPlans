/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable'
import { useDispatch } from 'react-redux'
import ResourceList from './ResourceList'
import {CSS} from '@dnd-kit/utilities'
import { setActiveForm } from '../features/lessons/activeFormSlice'

const SortableSection = ({ id, section, updateSectionTitle, deleteSection }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id} )

  const dispatch = useDispatch()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  const handleAddResource = () => {
    dispatch(setActiveForm({ type: 'Add Document', sectionId: section.id }))
  }

  return (
    <div ref={setNodeRef} style={style} className='section-item' {...attributes} {...listeners} >
      <input
        className='section-title-input'
        type='text'
        placeholder='Section Title'
        value={section.title}
        onChange={(e) => updateSectionTitle(section.id, e.target.value)}
      />
      <button onClick={() => deleteSection(section.id)}>Delete Section</button>
      <button onClick={handleAddResource}>Add Resource</button>
      <ResourceList sectionId={section.id} />

 </div>
  );
}

export default SortableSection