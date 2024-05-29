import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState: [],
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

     }
  }
})

export const { addResource, deleteResource, updateResources, reorderResources } = resourcesSlice.actions

export default resourcesSlice.reducer

/*
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState: [],
  reducers: {
    addResource: (state, action) => {
      const resourceWithId = { ...action.payload, id: uuidv4() }
      state.push(resourceWithId)
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
      
      const newResources = [...state]
      newResources.splice(newIndex, 0, newResources.splice(oldIndex, 1)[0])
      return newResources
 
    }
  }
})

export const { addResource, deleteResource, updateResources, reorderResources } = resourcesSlice.actions

export default resourcesSlice.reducer
*/