/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useQuery } from '@apollo/client'
import { GET_LESSONS } from '../queries'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import LessonListContextMenuHandler from './LessonListContextMenuHandler'
import FileMenuManager from './FileMenuManager'
import './LessonList.css'
import { MoreVert as MoreVertIcon, FolderOpen as FolderOpenIcon } from '@mui/icons-material'

const LessonList = ({ onSelect }) => {
  const navigate = useNavigate()
  const { data, loading, error} = useQuery(GET_LESSONS)

  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('null')
  const [contextPosition, setContextPosition] = useState(null)

//initial fetch
const lessons = data ? data.lessons : []

  const fileMenuItems = ['Create New', 'Open']
  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const sortedLessons = lessons ? [...lessons] : []

  if (sortConfig !== null && sortedLessons.length > 0) {
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

  const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp))
    return date.toLocaleDateString() === 'Invalid Date' ? 'No Date Available' : 
      date.toLocaleDateString("en-US", { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
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
            <th onClick={() => requestSort('sharedWith')}>Shared With</th>
            <th onClick={() => requestSort('dateModified')}>Date Modified</th>
            <th> <FolderOpenIcon /> </th>
          </tr>
        </thead>
        <tbody>
        {filteredLessons.length === 0 ? (
            <tr>
              <td colSpan="5">No lessons available</td>
            </tr>
          ) : (
            filteredLessons.map((lesson) => (
              <tr 
                style={{cursor: 'pointer'}}  
                key={lesson.id} 
                onClick={() => handleLessonClick(lesson)} 
              >
                <td>{lesson.title}</td> 
                <td>{lesson.courseAssociations.join(', ')}</td>
                <td>{lesson.createdBy}</td>
                <td>{lesson.sharedWith.map(user => user.username).join(', ')}</td>
                <td>{formatDate(lesson.dateModified)}</td>
                <td>
                  <MoreVertIcon 
                    className='more-vert-icon'
                    onClick={(event) => handleVertIconClick(event, lesson)} />
                </td>
              </tr>
            ))
          )}
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