import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { client } from '../../main'
import { GET_LESSONS, ADD_LESSON, UPDATE_LESSON, DELETE_LESSON } from '../../queries'

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
    try {
      await client.mutate({ mutation: DELETE_LESSON, variables: { id: lessonId } })
      return lessonId
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Share lesson
export const shareLesson = createAsyncThunk('lessons/shareLesson',
  async({ lessonId, users }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/lessons/${lessonId}/share`, { users })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Fetch shared lessons
export const fetchSharedLessons = createAsyncThunk('lessons/fetchSharedLessons',
  async (userId, { rejectWithValue}) => {
    try {
      const response = await api.get(`/users/${userId}/shared-lessons`)
      return response.data
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
      .addCase(shareLesson.fulfilled, (state, action) => {
        // placeholder
        console.log(action.payload)
        state.status = 'succeeded'
      })
      .addCase(shareLesson.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(fetchSharedLessons.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSharedLessons.fulfilled, (state, action) => {
        state.sharedLessons = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSharedLessons.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })

  }
})

export const { lessonAdded, lessonDeleted } = lessonsSlice.actions
export default lessonsSlice.reducer