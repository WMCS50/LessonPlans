import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../main'
import { GET_LESSONS, ADD_LESSON, UPDATE_LESSON, DELETE_LESSON, GET_LESSON } from '../../queries'

// Fetch lesson
export const fetchLesson = createAsyncThunk('lessons/fetchLesson',
  async (id) => {
    const response = await client.query({ query: GET_LESSON, variables: { id }, skip: !id })
    return response.data.lesson
  }
)

// Fetch lessons
export const fetchLessons = createAsyncThunk('lessons/fetchLessons',
  async () => {
    const response = await client.query({ query: GET_LESSONS })
    return response.data.lessons
  }
)

// Add lesson
export const addLesson = createAsyncThunk('lessons/addLesson',
  async (lesson) => {
    const response = await client.mutate({ mutation: ADD_LESSON, variables: { ...lesson } })
    return response.data.addLesson
  }
)

// Update lesson
export const updateLesson = createAsyncThunk('lessons/updateLesson',
  async ({ id, lesson }) => {
    const response = await client.mutate({ mutation: UPDATE_LESSON, variables: {id, ...lesson} })
    return response.data.updateLesson
  }
)

// Delete lesson
export const deleteLesson = createAsyncThunk('lessons/deleteLesson',
  async (lessonId, { rejectWithValue }) => {
    console.log('lessonId')
    try {
      await client.mutate({ 
        mutation: DELETE_LESSON, 
        variables: { 
          id: lessonId 
        },
        refetchQueries: [{ query: GET_LESSONS }]
      })
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchLesson.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchLesson.fulfilled, (state, action) => {
        state.loading = false
        state.lesson = action.payload
      })
      .addCase(fetchLesson.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
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
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter(lesson => lesson.id !== action.payload);
        state.status = 'succeeded'
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(lesson => lesson.id === action.payload.id)
        index !== -1 ? state.lessons[index] = action.payload : null
        state.status = 'succeeded'
      })
      .addCase(updateLesson.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
  }
})

export default lessonsSlice.reducer