/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable'
import { useDispatch } from 'react-redux'
import ResourceList from './ResourceList'
import { updateSection, deleteSection } from '../features/lessons/sectionsSlice';
import {CSS} from '@dnd-kit/utilities'

const SortableSection = ({ section, isActive, onClick }) => {
  const { id, title } = section
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id })

  const dispatch = useDispatch()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const handleUpdateSectionTitle = (e) => {
    dispatch(updateSection({ sectionId: id, title: e.target.value }));
  }

  const handleDeleteSection = () => {
    dispatch(deleteSection(id));
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`section-item ${isActive ? 'active-section' : ''}`} 
      {...attributes} 
      {...listeners}
      onClick={onClick}
    >
      <input
        className={'section-title-input'}
        type='text'
        placeholder='Section Title'
        value={title || ''}
        onChange={handleUpdateSectionTitle}
      />
      <button onClick={handleDeleteSection}>Delete Section</button>
      <ResourceList sectionId={id} />
 </div>
  )
}

export default SortableSection