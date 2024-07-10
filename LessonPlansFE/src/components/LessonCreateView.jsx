/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import { resetSections, updateSections, addSection } from '../features/lessons/sectionsSlice'
import axios from 'axios'
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
  const fileMenuItems = ['Save', 'Save As New','Create New', 'Open', 'Share']
  const resources = useSelector((state) => state.resources)
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)
    const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      courseAssociations: [],
      sections: [],
      resources: []
    })
  const [contextPosition, setContextPosition] = useState(null)
    
//Resets title and sections for new lesson, then creates and sets active the first section
  useEffect(() => {
    dispatch(resetResources())
    dispatch(resetSections())
    if (!id) {
      setCurrentLesson({
        id: null,
        title: '',
        courseAssociations: [],
        sections: [],
        resources: [],
      })
      dispatch(addSection({ section: { title: '', resources: [] } }))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (sections.length > 0) {
      dispatch(setActiveSection(sections[0].id))
    }
  }, [sections, dispatch])

//Fetches existing lesson data if navigated to from read view.
  useEffect(() => {
    if (id) {
      const fetchLesson = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/lessons/${id}`)
          const lessonData = response.data
          console.log('lessonData', lessonData)
          setCurrentLesson(lessonData)
          dispatch(updateSections(lessonData.sections))
          dispatch(updateResources(lessonData.resources))
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
      fetchLesson()
    }
  }, [id, dispatch])

  //determine click position for context menu
  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  //preview lesson option in a new window pop out
  const handlePreview = () => {
    const lessonPreviewData = { ...currentLesson, sections, resources }
    localStorage.setItem('lessonPreviewData', JSON.stringify(lessonPreviewData))
    const previewUrl = window.location.origin + '/preview?preview=true'
    const windowFeatures = "width=800, height=600, left=200, top=200, resizable, scrollbars, status"
    window.open(previewUrl, 'LessonPreview', windowFeatures)
  }

  return (
    <div className='lesson-create-view' onContextMenu={handleContextMenu}>
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
      <div className='app-bar'>
        <ResponsiveAppBar className='responsive-app-bar'
          setActiveForm={(form) => dispatch(setActiveForm(form))}
          resourcesLength={resources.length} />
        <ActiveForm activeSectionId={activeSectionId} />
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


/* prior to popout
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import { resetSections, updateSections, addSection } from '../features/lessons/sectionsSlice'
import { setPreviewLesson } from '../features/lessons/lessonPreviewSlice'
import axios from 'axios'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import SectionList from './SectionList'
import ContextMenuHandler from './ContextMenuHandler'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileMenuItems = ['Save', 'Save As New','Create New', 'Open', 'Share']
  const resources = useSelector((state) => state.resources)
  const sections = useSelector((state) => state.sections)
  const activeSectionId = useSelector((state) => state.activeSection)
    const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      courseAssociations: [],
      sections: [],
      resources: []
    })
  const [contextPosition, setContextPosition] = useState(null)
    
//Resets title and sections for new lesson, then creates and sets active the first section
  useEffect(() => {
    dispatch(resetResources())
    dispatch(resetSections())
    if (!id) {
      setCurrentLesson({
        id: null,
        title: '',
        courseAssociations: [],
        sections: [],
        resources: [],
      })
      dispatch(addSection({ section: { title: '', resources: [] } }))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (sections.length > 0) {
      dispatch(setActiveSection(sections[0].id))
    }
  }, [sections, dispatch])

//Fetches existing lesson data if navigated to from read view.
  useEffect(() => {
    if (id) {
      const fetchLesson = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/lessons/${id}`)
          const lessonData = response.data
          console.log('lessonData', lessonData)
          setCurrentLesson(lessonData)
          dispatch(updateSections(lessonData.sections))
          dispatch(updateResources(lessonData.resources))
        } catch (error) {
          console.error('Error fetching lesson:', error)
        }
      }
      fetchLesson()
    }
  }, [id, dispatch])

  //determine click position for context menu
  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  //preview lesson option in a new window
    const handlePreview = () => {
      const lessonPreviewData = { ...currentLesson, sections, resources }
      dispatch(setPreviewLesson(lessonPreviewData))
      navigate('/preview')
    }
  
    return (
      <div className='lesson-create-view' onContextMenu={handleContextMenu}>
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
        <div className='app-bar'>
          <ResponsiveAppBar className='responsive-app-bar'
            setActiveForm={(form) => dispatch(setActiveForm(form))}
            resourcesLength={resources.length} />
          <ActiveForm activeSectionId={activeSectionId} />
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
  */