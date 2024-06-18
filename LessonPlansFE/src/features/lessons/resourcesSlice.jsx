import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = []

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action) => {
      const { resource, index, sectionId } = action.payload
      const section = state.find((s) => s.id === sectionId)
      if (section) {
        const resourceWithId = { ...resource, id: uuidv4() }
        section.resources.splice(index, 0, resourceWithId)
      }
    },
    deleteResource: (state, action) => {
      const { resourceId, sectionId } = action.payload
      const section = state.find((s) => s.id === sectionId)
      if (section) {
        section.resources = section.resources.filter(resource => resource.id !== resourceId)
      }
      
    },
    updateResources: (state, action) => {
      const { resources, sectionId } = action.payload
      const section = state.find((s) => s.id === sectionId)
      if (section) {
        section.resources = resources
      }
    },
    reorderResources: (state, action) => {
      const { activeId, overId, sectionId } = action.payload
      const section = state.find((s) => s.id === sectionId)
      if (section) {
        const oldIndex = section.resources.findIndex(resource => resource.id === activeId)
        const newIndex = section.resources.findIndex(resource => resource.id === overId)      
        if (oldIndex !== -1 && newIndex !== -1) {
          const [movedItem] = section.resources.splice(oldIndex, 1)
          section.resources.splice(newIndex, 0, movedItem)
        }
      }
     },
    resetResources: () => initialState
  }
})

export const { addResource, deleteResource, updateResources, reorderResources, resetResources } = resourcesSlice.actions

export default resourcesSlice.reducer

/* prior to sections
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = []

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action) => {
      const { resource, index } = action.payload
      const resourceWithId = { ...resource, id: uuidv4() }
      state.splice(index, 0, resourceWithId)
    },
    deleteResource: (state, action) => {
      return state.filter(resource => resource.id !== action.payload)
    },
    updateResources: (state, action) => {
      return action.payload
    },
    reorderResources: (state, action) => {
      const { activeId, overId} = action.payload
      const oldIndex = state.findIndex(resource => resource.id === activeId)
      const newIndex = state.findIndex(resource => resource.id === overId)      
      if (oldIndex !== -1 && newIndex !== 1) {
        const newState = [...state]
        const [movedItem] = newState.splice(oldIndex, 1)
        newState.splice(newIndex, 0, movedItem)
        return newState
      }
      return state
     },
    resetResources: () => initialState
  }
})

export const { addResource, deleteResource, updateResources, reorderResources, resetResources } = resourcesSlice.actions

export default resourcesSlice.reducer
*/