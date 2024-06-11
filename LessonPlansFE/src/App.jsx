import { Routes, Route, Navigate } from 'react-router-dom'
import SignInPage from './components/SignInPage'
import LessonList from './components/LessonList'
import LessonReadView from './components/LessonReadView'
import LessonCreateView from './components/LessonCreateView'
import { useSelector } from 'react-redux'

const App = () => {
  const user = useSelector(state => state.auth.user)
  console.log('App sees user', user)
  return (
    <div>
      <Routes>
          <Route path='/' element={!user ? <SignInPage /> : <Navigate replace to='lessons'/>} />
          <Route path='/lessons' element={<LessonList />} />
          <Route path='/lessons/:id' element={<LessonReadView />} />
          <Route path='/create' element={<LessonCreateView />} />
          <Route path='/create/:id' element={<LessonCreateView />} />
          <Route path='/lesson-preview' element={<LessonReadView />} />
 
      </Routes>
    </div>
  )
}

export default App
