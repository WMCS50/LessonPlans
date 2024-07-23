/* eslint-disable react/prop-types */
import { useSortable } from '@dnd-kit/sortable'
import { useDispatch } from 'react-redux'
import ResourceList from './ResourceList'
import { updateSection } from '../features/lessons/sectionsSlice';
import { useDeleteSection } from '../hooks/useDeleteSection'
import {CSS} from '@dnd-kit/utilities'
import './SortableSection.css'

const SortableSection = ({ section, isActive, onClick }) => {
  const { id: sectionId, title } = section

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sectionId })

  const dispatch = useDispatch()
  const { handleDeleteSection } = useDeleteSection()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  
  const handleUpdateSectionTitle = (e) => {
    dispatch(updateSection({ sectionId, title: e.target.value }));
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
      <button onClick={()=> handleDeleteSection(sectionId)}>Delete Section</button>
      <ResourceList sectionId={sectionId} />
    </div>
  )
}

export default SortableSection