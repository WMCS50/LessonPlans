import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import lessonsReducer from '../features/lessons/lessonsSlice'
import activeFormReducer from '../features/lessons/activeFormSlice'
import resourcesReducer from '../features/lessons/resourcesSlice'
import sectionsReducer from '../features/lessons/sectionsSlice'
import activeSectionReducer from '../features/lessons/activeSectionSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    lessons: lessonsReducer,
    activeForm: activeFormReducer,
    resources: resourcesReducer,
    sections: sectionsReducer,
    activeSection: activeSectionReducer
  }
})