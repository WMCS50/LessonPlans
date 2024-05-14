import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const signIn = createAsyncThunk('auth/signIn',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios
        .post('http://localhost:3001/auth/login', { username, password })
        console.log('sign in data', response.data)
        return response.data
    } catch (error) {
      console.log('error data', error.response.data)
      return rejectWithValue(error.response.data)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    error: null,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload
        state.status = 'succeeded'
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
  }
})

export default authSlice.reducer

