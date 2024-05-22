import { createSlice } from '@reduxjs/toolkit'

export const activeFormSlice = createSlice({
  name: 'activeForm',
  initialState: null,
  reducers: {
    setActiveForm: (state, action) => action.payload,
    resetActiveForm: () => null
  }
})

export const { setActiveForm, resetActiveForm } = activeFormSlice.actions

export default activeFormSlice.reducer