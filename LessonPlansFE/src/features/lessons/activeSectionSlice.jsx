import { createSlice } from '@reduxjs/toolkit'

export const activeSectionSlice = createSlice({
  name: 'activeSection',
  initialState: null,
  reducers: {
    setActiveSection: (state, action) => action.payload,
    resetActiveSection: () => null
  }
})

export const { setActiveSection, resetActiveSection } = activeSectionSlice.actions

export default activeSectionSlice.reducer