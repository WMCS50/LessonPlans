/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLessons } from '../features/lessons/lessonsSlice'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import LessonListContextMenuHandler from './LessonListContextMenuHandler'
import FileMenuManager from './FileMenuManager'
import './LessonList.css'
import { MoreVert as MoreVertIcon, FolderOpen as FolderOpenIcon } from '@mui/icons-material'

const LessonList = ({ onSelect }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const lessons = useSelector((state) => state.lessons.lessons)
  const lessonsStatus = useSelector((state) => state.lessons.status)
  const error = useSelector((state) => state.lessons.error)
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('null')
  const [contextPosition, setContextPosition] = useState(null)

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
    lesson.title && lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) 

  const handleLessonClick = (lesson) => {
    onSelect ? onSelect(lesson) : navigate(`/lessons/${lesson.id}`)
  }

  const handleVertIconClick = (event, lesson) => {
    event.stopPropagation()
    event.preventDefault()
    setContextPosition({ x: event.clientX, y: event.clientY })
    setSelectedLesson(lesson)
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
        <button onClick={() => navigate('/create')}>
          Create New
        </button>
        <UserMenu />
      </header>

      <table className='lesson-table'>
        <thead>
          <tr>
            <th onClick={() => requestSort('title')}>Title</th>
            <th onClick={() => requestSort('courseAssociations')}>Course Associations</th>
            <th onClick={() => requestSort('createdBy')}>Created By</th>
            <th onClick={() => requestSort('dateModified')}>Date Modified</th>
            <th> <FolderOpenIcon /> </th>
          </tr>
        </thead>
        <tbody>
          {filteredLessons.map((lesson) => (
            <tr 
              style={{cursor: 'pointer'}}  
              key={lesson.id} 
              onClick={() => handleLessonClick(lesson)} 
            >
              <td>{lesson.title}</td> 
              <td>{lesson.courseAssociations}</td>
              <td>{lesson.createdBy}</td>
              <td>{new Date(lesson.dateModified).toLocaleDateString()}</td>
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
          <LessonListContextMenuHandler
            contextPosition={contextPosition}
            setContextPosition={setContextPosition}
            selectedLesson={selectedLesson}
          />
        )}
    </div>
  )
}

export default LessonList