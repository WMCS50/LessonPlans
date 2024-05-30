import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchLessons } from '../features/lessons/lessonsSlice'
import { useNavigate } from 'react-router-dom'
import UserMenu from './UserMenu'
import './LessonList.css'

//placeholder logo
import SchoolIcon from '@mui/icons-material/School' 
import { green } from '@mui/material/colors'

const LessonList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const lessons = useSelector((state) => state.lessons.lessons)
  console.log('Lessons from state:', lessons);
  const lessonsStatus = useSelector((state) => state.lessons.status)
  const error = useSelector((state) => state.lessons.error)
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' })
  const [searchQuery, setSearchQuery] = useState('')

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
    if (lessonsStatus === 'idle') {
      dispatch(fetchLessons())
    }
  }, [lessonsStatus, dispatch])

  //filters lesson based on searchQuery
  const filteredLessons = sortedLessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) 

  return (
    <div>
      <header className='lesson-list-header'>
        <SchoolIcon sx={{ width: 50, height: 50 , color: green[900] }} />
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
          </tr>
        </thead>
        <tbody>
          {filteredLessons.map((lesson) => (
            <tr 
              key={lesson.id} 
              onClick={() => navigate(`/lessons/${lesson.id}`)}
              style={{cursor: 'pointer'}}
            >
              <td>{lesson.title}</td> 
              <td>{lesson.courseAssociation}</td>
              <td>{lesson.createdBy}</td>
              <td>{lesson.dateAdded}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {lessonsStatus === 'loading' && <p>Loading...</p>}
      {lessonsStatus === 'failed' && <p>Error: {error}</p>}
    </div>
    
  )
}

export default LessonList