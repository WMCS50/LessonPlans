/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import { resetSections, updateSections, addSection } from '../features/lessons/sectionsSlice'
import { fetchLesson } from '../features/lessons/lessonsSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import SectionList from './SectionList'
import ContextMenuHandler from './ContextMenuHandler'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const resources = useSelector((state) => state.resources)
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)
  
  console.log('activeSectionId from LCV', activeSectionId)
  console.log('lessonId from LCV', id)

  const [currentLesson, setCurrentLesson] = useState({ 
    id: null, 
    title: '',
    courseAssociations: [],
    sections: [],
    resources: []
  })
  const [contextPosition, setContextPosition] = useState(null)
  const fileMenuItems = ['Save', 'Save As New','Create New', 'Open']
  if (currentLesson.id) {
    fileMenuItems.push('Share')
  }

//Fetches existing lesson data if navigated to from read view
//Resets title and sections for new lesson and adds the first section
useEffect(() => {
  if (id) {
    dispatch(fetchLesson(id))
    .unwrap()
    .then((lessonData) => {
      console.log('Fetched lesson data:', lessonData)
      setCurrentLesson(lessonData);
      dispatch(updateSections(lessonData.sections))
      dispatch(updateResources(lessonData.resources))
    })
    .catch((error) => {
      console.error('Failed to fetch lesson:', error)
    });
  } else {
    dispatch(resetResources())
    dispatch(resetSections())
    setCurrentLesson({
      id: null,
      title: '',
      courseAssociations: [],
      sections: [],
      resources: [],
    })
    dispatch(addSection({ section: { title: '' } }))
  }
}, [dispatch, id])

  //determine click position for context menu
  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  //preview lesson option in a new window pop out
  const handlePreview = () => {
    const lessonPreviewData = { ...currentLesson, sections, resources }
    console.log('CL in preview', lessonPreviewData)
    localStorage.setItem('lessonPreviewData', JSON.stringify(lessonPreviewData))
    const previewUrl = window.location.origin + '/preview'
    const windowFeatures = "width=800, height=600, left=200, top=200, resizable, scrollbars, status"
    window.open(previewUrl, 'LessonPreview', windowFeatures)
  }

  return (
    <div className='lesson-create-view' onContextMenu={handleContextMenu}>
      <div className='header'>
        <div className='above-app-bar'>
          <FileMenuManager 
            currentLesson={currentLesson} 
            setCurrentLesson={setCurrentLesson} 
            resources={resources}
            sections={sections}
            fileMenuItems={fileMenuItems}
          />
          <input 
            className='lesson-title-input'
            type='text'
            placeholder='Enter Lesson Title'
            value={currentLesson.title}
            onChange={(e) => setCurrentLesson({ ...currentLesson, title: e.target.value})}
          />
          <input 
            className='lesson-course-associations-input'
            type='text'
            placeholder='Enter Course Associations (comma separated)'
            value={currentLesson.courseAssociations}
            onChange={(e) => setCurrentLesson({ ...currentLesson, courseAssociations: e.target.value})}
          />
          <button onClick={handlePreview}>Preview</button>
          <UserMenu className='user-menu'/>
        </div>
        <div className='app-bar-container'>
          <div className='app-bar'>
            <ResponsiveAppBar className='responsive-app-bar'
              setActiveForm={(form) => dispatch(setActiveForm(form))}
              resourcesLength={resources.length} />
            <ActiveForm activeSectionId={activeSectionId} lessonId={id}/>
          </div>
        </div>
      </div>
      <div className='create-area'>
        <SectionList />
      </div>
      <ContextMenuHandler 
        contextPosition={contextPosition}
        setContextPosition={setContextPosition}
        currentLesson={currentLesson}
      />
    </div>
  )
}

export default LessonCreateView
