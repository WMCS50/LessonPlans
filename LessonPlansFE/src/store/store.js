import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import lessonsReducer from '../features/lessons/lessonsSlice'
import lessonPreviewReducer from '../features/lessons/lessonPreviewSlice'
import activeFormReducer from '../features/lessons/activeFormSlice'
import resourcesReducer from '../features/lessons/resourcesSlice'
import sectionsReducer from '../features/lessons/sectionsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    lessonPreview: lessonPreviewReducer,
    activeForm: activeFormReducer,
    resources: resourcesReducer,
    sections: sectionsReducer
  }
})