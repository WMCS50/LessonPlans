//prior to objectIDs
import { createSlice } from '@reduxjs/toolkit'
//import { v4 as uuidv4 } from 'uuid'
import mongoose from 'mongoose'

const initialState = []
const { ObjectId } = mongoose.Types

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action) => {
      const { section } = action.payload
      //const sectionWithId = { ...section, id: uuidv4() }
      const sectionWithId = { ...section, id: new ObjectId().toString()}
      return state.concat(sectionWithId)
    },
    deleteSection: (state, action) => {
      return state.filter(section => section.id !== action.payload)
    },
    updateSections: (state, action) => {
      return action.payload
    },
/*     updateSection: (state, action) => {
      const { sectionId, title } = action.payload
      const index = state.findIndex((section) => section.id === sectionId)
      if (index !== -1) {
        state[index].title = title
      }
    }, */
    updateSection: (state, action) => {
      const { sectionId, title } = action.payload
      return state.map(section =>
        section.id === sectionId ? { ...section, title } : section
      )
    },
    reorderSections: (state, action) => {
      const { activeId, overId} = action.payload
      const oldIndex = state.findIndex(section => section.id === activeId)
      const newIndex = state.findIndex(section => section.id === overId)      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newState = [...state]
        const [movedItem] = newState.splice(oldIndex, 1)
        newState.splice(newIndex, 0, movedItem)
        return newState
      }
      return state
     },
    resetSections: () => initialState
  }
})

export const { addSection, deleteSection, updateSection, updateSections, reorderSections, resetSections } = sectionsSlice.actions

export default sectionsSlice.reducer


/* import { createSlice} from '@reduxjs/toolkit'
import mongoose from 'mongoose'

const { ObjectId } = mongoose.Types

const initialState = []

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action) => {
      const { section } = action.payload
      const sectionWithId = { ...section, id: new ObjectId().toString() }
      return state.concat(sectionWithId)
    },
    deleteSection: (state, action) => {
      return state.filter(section => section.id !== action.payload)
    },
    updateSections: (state, action) => {
      return action.payload
    },
    updateSection: (state, action) => {
      const { sectionId, title } = action.payload
      const index = state.findIndex((section) => section.id === sectionId)
      if (index !== -1) {
        state[index].title = title
      }
    },
    reorderSections: (state, action) => {
      const { activeId, overId} = action.payload
      const oldIndex = state.findIndex(section => section.id === activeId)
      const newIndex = state.findIndex(section => section.id === overId)      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newState = [...state]
        const [movedItem] = newState.splice(oldIndex, 1)
        newState.splice(newIndex, 0, movedItem)
        return newState
      }
      return state
     },
    resetSections: () => initialState
  }
})

export const { addSection, deleteSection, updateSection, updateSections, reorderSections, resetSections } = sectionsSlice.actions

export default sectionsSlice.reducer
 */


