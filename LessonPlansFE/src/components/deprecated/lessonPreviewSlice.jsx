import { createSlice} from '@reduxjs/toolkit'

const lessonPreviewSlice = createSlice({
  name: 'lesson',
  initialState: {
    lesson: null
  },
  reducers: {
    setPreviewLesson: (state, action) => {
      state.lesson = action.payload
    },
    clearPreviewLesson: state => {
      state.lesson = null
    }
  },
  
})

export const { setPreviewLesson, clearPreviewLesson } = lessonPreviewSlice.actions
export default lessonPreviewSlice.reducer