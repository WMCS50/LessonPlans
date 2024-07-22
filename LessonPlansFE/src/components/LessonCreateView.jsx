/* eslint-disable react/prop-types */
//new -- only graphql where necessary
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import { resetSections, updateSections, addSection } from '../features/lessons/sectionsSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import SectionList from './SectionList'
import ContextMenuHandler from './ContextMenuHandler'
import { useQuery } from '@apollo/client'
import { GET_LESSON } from '../queries'
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
const { data } = useQuery(GET_LESSON, {
  variables: { id },
  skip: !id
})  

useEffect(() => {
  if (id && data) {
    const lessonData = data.lesson
    try {
      console.log('lessonData', lessonData)
      setCurrentLesson(lessonData)
      dispatch(updateSections(lessonData.sections))
      dispatch(updateResources(lessonData.resources))
    } catch (error) {
      console.error('Error setting lesson:', error)
    }
  }
}, [id, dispatch, data])

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




/* with graphql
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import SectionList from './SectionList'
import ContextMenuHandler from './ContextMenuHandler'
import { useQuery, useMutation } from '@apollo/client'
import { GET_LESSON, ADD_SECTION, ADD_LESSON } from '../queries'
import './LessonCreateView.css'

const LessonCreateView = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const fileMenuItems = ['Save', 'Save As New','Create New', 'Open', 'Share']
  const username = JSON.parse(localStorage.getItem('user')).username
  const [currentLesson, setCurrentLesson] = useState(
    { id: null, 
      title: '',
      courseAssociations: [],
      sections: [],
      resources: []
    })
  const [contextPosition, setContextPosition] = useState(null)
  
  //Need this ref to track initial lesson creation (was always creating 2x)
  const hasCreatedInitialLesson = useRef(false)

  //Fetches existing lesson data if navigated to from read view
  //Creates and sets active the first section if creating a new lesson
  const { data } = useQuery(GET_LESSON, {
    variables: { id },
    skip: !id,
  })

  const [addLessonMutation] = useMutation(ADD_LESSON)
  const [addSectionMutation] = useMutation(ADD_SECTION)
  
  useEffect(() => {
    if (data && data.lesson) {
      const lessonData = data.lesson
      console.log('lessonData', lessonData)
      setCurrentLesson(lessonData)
      if (lessonData.sections.length > 0) {
        dispatch(setActiveSection(lessonData.sections[0].id))
      }
    }
  }, [data, dispatch])
  
  useEffect(() => {
    const createInitialLessonAndSection = async () => {
      if (!username) {
        console.error('User not authenticated')
        return
      }
  
      try {
        //create initial lesson
        const lessonResponse = await addLessonMutation({
          variables: {
            title: 'New Lesson',
            sections: [],
            resources: [],
            createdBy: username,
            dateModified: new Date().toISOString(),
            courseAssociations: [],
          },
        })
        const newLesson = lessonResponse.data.addLesson
        setCurrentLesson(newLesson)
        console.log('new lesson created')

        //create initial section
        
        try {
          console.log('Attempting to create initial section for lesson ID:', newLesson.id)
          
          const sectionResponse = await addSectionMutation({ 
            variables: { 
              title: 'Untitled Section',
              lessonId: newLesson.id
            } 
          })
          console.log('Section response received:', sectionResponse)

          const newSection = sectionResponse.data.addSection
          console.log('New section created:', newSection)

          setCurrentLesson((prevLesson) => ({
            ...prevLesson,
            sections: [...prevLesson.sections, newSection],
          }))

          console.log('New section ID:', newSection.id)

          dispatch(setActiveSection(newSection.id))

          console.log('Active section set to new section ID:', newSection.id)
        } catch(error) {
          console.error('Error creating initial section')
        }
      } catch (error) {
        console.error('Error initial lesson', error)
      }
    }
    if (!id && !currentLesson.id && !hasCreatedInitialLesson.current) {
      createInitialLessonAndSection()
      hasCreatedInitialLesson.current = true
    }
  }, [id, addLessonMutation, addSectionMutation, username, dispatch, currentLesson.id])

  //determine click position for context menu
  const handleContextMenu = (event) => {
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
  }

  //preview lesson option in a new window pop out
  const handlePreview = () => {
    const lessonPreviewData = { 
      ...currentLesson, 
      sections: currentLesson.sections, 
      resources: currentLesson.resources 
    }
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
          resources={currentLesson.resources}
          sections={currentLesson.sections}
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
          resourcesLength={currentLesson.resources.length} />
        <ActiveForm currentLesson={currentLesson} setCurrentLesson={setCurrentLesson} />
      </div>
      <div className='create-area'>
        <SectionList currentLesson={currentLesson} />
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

/*prior to BE integration
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { setActiveForm } from '../features/lessons/activeFormSlice'
import { setActiveSection } from '../features/lessons/activeSectionSlice'
import { resetResources, updateResources } from '../features/lessons/resourcesSlice'
import { resetSections, updateSections, addSection } from '../features/lessons/sectionsSlice'
import ResponsiveAppBar from './ResponsiveAppBar'
import ActiveForm from './ActiveForm'
import UserMenu from './UserMenu'
import FileMenuManager from './FileMenuManager'
import SectionList from './SectionList'
import ContextMenuHandler from './ContextMenuHandler'
import './LessonCreateView.css'
import api from '../../api'

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
          const response = await api.get(`/${id}`)
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
*/