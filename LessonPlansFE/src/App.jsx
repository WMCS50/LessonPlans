import { Routes, Route, Navigate } from 'react-router-dom'
import SignInPage from './components/SignInPage'
import LessonList from './components/LessonList'
import LessonReadView from './components/LessonReadView'
import LessonCreateView from './components/LessonCreateView'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { loadUserFromStorage } from './features/auth/authSlice'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const status = useSelector(state => state.auth.status)

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <div>
      <Routes>
          <Route path='/' element={!user ? <SignInPage /> : <Navigate replace to='lessons'/>} />
          <Route path='/lessons' element={<LessonList />} />
          <Route path='/lessons/:id' element={<LessonReadView />} />
          <Route path='/create' element={<LessonCreateView />} />
          <Route path='/create/:id' element={<LessonCreateView />} />
          <Route path='/preview' element={<LessonReadView />} />
 
      </Routes>
    </div>
  )
}

export default App
