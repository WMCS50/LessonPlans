import { createSlice } from '@reduxjs/toolkit'
import { client } from '../../main'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    error: null,
    status: 'idle'
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      localStorage.clear()
      client.resetStore()
    },
    loadUserFromStorage: (state) => {
      state.status = 'loading'
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      if (storedUser && storedToken) {
        state.user = JSON.parse(storedUser)
        state.token = storedToken
        state.status = 'succeeded'
      } else {
        state.status = 'idle'
      }
    },
    setUser: (state, action) => {
      state.user = action.payload
      state.token = action.payload.token
      localStorage.setItem('user', JSON.stringify(action.payload))
      localStorage.setItem('token', action.payload.token)
    }
  },
})

export const { logout, loadUserFromStorage, setUser } = authSlice.actions

export default authSlice.reducer
