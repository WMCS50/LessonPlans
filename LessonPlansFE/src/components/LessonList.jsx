/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLessons } from '../features/lessons/lessonsSlice'
import { useDeleteLesson } from '../hooks/useDeleteLesson'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import CustomContextMenu from './CustomContextMenu'
import FileMenuManager from './FileMenuManager'
import './LessonList.css'
import {
  MoreVert as MoreVertIcon, FolderOpen as FolderOpenIcon,
  Edit as EditIcon,   Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material'

const LessonList = ({ onSelect }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const lessons = useSelector((state) => state.lessons.lessons)
  const lessonsStatus = useSelector((state) => state.lessons.status)
  const error = useSelector((state) => state.lessons.error)
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [contextPosition, setContextPosition] = useState(null)
  const { handleDeleteLesson } = useDeleteLesson()

  const fileMenuItems = ['Create New', 'Open']

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  let sortedLessons = [...lessons]
  if (sortConfig !== null) {
    sortedLessons.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  useEffect(() => {
    if (lessonsStatus === 'idle' ) {
      dispatch(fetchLessons())
    }
  }, [lessonsStatus, dispatch])

  //filters lesson based on searchQuery
  const filteredLessons = sortedLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) 

  const handleContextMenu = (event, lesson) => {
    event.preventDefault()
    setSelectedLesson(lesson)
    setContextPosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  const handleVertIconClick = (event, lesson) => {
    event.stopPropagation()
    setSelectedLesson(lesson)
    setContextPosition({
      x: event.clientX,
      y: event.clientY
    })
  }

  const contextMenuOptions = [
    { label: 'Open in new window', value: 'open', icon: <OpenInNewIcon /> },
    { label: 'Edit lesson', value: 'edit', icon: <EditIcon /> },
    { label: 'Delete lesson', value: 'delete', icon: <DeleteIcon /> }
  ]

  const handleOptionSelect = (option) => {
    if (option.value === 'delete') {
      handleDeleteLesson(selectedLesson.id)
    } else if (option.value === 'open') {
      window.open(`/lessons/${selectedLesson.id}`, '_blank')
    }
    setContextPosition(null)
  }

  const handleLessonClick = (lesson) => {
    onSelect ? onSelect(lesson) : navigate(`/lessons/${lesson.id}`)
  }

  return (
    <div>
      {lessonsStatus === 'loading' && <p>Loading...</p>}
      {lessonsStatus === 'failed' && <p>Error: {error}</p>}
      <header className='lesson-list-header'>
        <FileMenuManager fileMenuItems={fileMenuItems} skipDialogs={true} />
        <input 
          className='search-bar' 
          type='text' 
          placeholder='Search Lesson Title'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <UserMenu />
      </header>
      <button className='create-lesson-button' onClick={() => navigate('/create')}>
        Create New Lesson
      </button>
      <table className='lesson-table'>
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>Title</th>
            <th onClick={() => requestSort('courseAssociation')}>Course Association</th>
            <th onClick={() => requestSort('createdBy')}>Created by</th>
            <th onClick={() => requestSort('dateAdded')}>Date added</th>
            <th> <FolderOpenIcon /> </th>
          </tr>
        </thead>
        <tbody>
          {filteredLessons.map((lesson) => (
            <tr 
              style={{cursor: 'pointer'}}  
              key={lesson.id} 
                onClick={() => handleLessonClick(lesson)} 
                onContextMenu={(event) => handleContextMenu(event, lesson)}>
              <td>{lesson.title}</td> 
              <td>{lesson.courseAssociation}</td>
              <td>{lesson.createdBy}</td>
              <td>{lesson.dateAdded}</td>
              <td>
                <MoreVertIcon 
                  className='more-vert-icon'
                  onClick={(event) => handleVertIconClick(event, lesson)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {contextPosition && (
        <CustomContextMenu
          options={contextMenuOptions}
          position={contextPosition}
          onOptionSelect={handleOptionSelect}
        />
      )}
    </div>
    
  )
}

export default LessonList