import { useDispatch, useSelector } from 'react-redux'
import { reorderSections } from '../features/lessons/sectionsSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import SortableSection from './SortableSection'
import DragAndDropHandler from './DragAndDropHandler'

const SectionList = () => {
  const dispatch = useDispatch()
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)

  const handleSectionClick = (sectionId) => {
    dispatch(setActiveSection(sectionId))
  }
  return (
    <div>
      <DragAndDropHandler
        items={sections.map(section => section.id)}
        onReorder={reorderSections}
      >
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
      </DragAndDropHandler>
    </div>
  )
}

export default SectionList