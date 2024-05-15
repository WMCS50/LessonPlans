import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import lessonsReducer from '../features/lessons/lessonsSlice'
import lessonPreviewReducer from '../features/lessons/lessonPreviewSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    lessonPreview: lessonPreviewReducer,
  }
})