import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchLessons = createAsyncThunk('lessons/fetchLessons',
  async () => {
    const response = await axios.get('http://localhost:3001/lessons')
    return response.data
  }
)

const lessonsSlice = createSlice({
  name: 'lessons',
  initialState: {
    lessons: [],
    status: 'idle',
    error: null
  },
  reducers: {},
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
  }
})

export default lessonsSlice.reducer