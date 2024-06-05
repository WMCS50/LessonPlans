import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// Fetch lessons
export const fetchLessons = createAsyncThunk('lessons/fetchLessons',
  async () => {
    const response = await axios.get('http://localhost:3001/lessons')
    return response.data
  }
)

//Add lesson
export const addLesson = createAsyncThunk('lessons/addLesson',
  async (lesson) => {
    const response = await axios.post('http://localhost:3001/lessons', lesson)
    return response.data
  }
)

//Update lesson
export const updateLesson = createAsyncThunk('lessons/updateLesson',
  async ({ id, lesson }) => {
    const response = await axios.put(`http://localhost:3001/lessons${id}`, lesson)
    return response.data
  }
)

// Delete lesson
export const deleteLesson = createAsyncThunk('lessons/deleteLesson',
  async (lessonId, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:3001/lessons/${lessonId}`)
      return lessonId
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Create slice
const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    lessons: [],
    status: 'idle',
    error: null
  },
  reducers: {
    lessonAdded: (state, action) => {
      state.lessons.push(action.payload)
    },
    lessonDeleted: (state, action) => {
      state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.lessons = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(addLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
        state.status = 'succeeded'
      })
      .addCase(addLesson.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
        state.status = 'succeeded'
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id)
        index !== -1 ? state.lessons[index] = action.payload : null
        state.status = 'succeeded'
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
  }
})

export const { lessonAdded, lessonDeleted } = lessonsSlice.actions
export default lessonsSlice.reducer