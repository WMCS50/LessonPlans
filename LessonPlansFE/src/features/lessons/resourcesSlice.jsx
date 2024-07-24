import { createSlice } from '@reduxjs/toolkit'
import mongoose from 'mongoose'

const initialState = []
const { ObjectId } = mongoose.Types

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action) => {
      const { resource, sectionId, index } = action.payload
      const resourceWithId = { ...resource, id: new ObjectId().toString(), sectionId }
      state.splice(index, 0, resourceWithId)
    },
    deleteResource: (state, action) => {
      const { resourceId, sectionId } = action.payload
      return state.filter(resource => resource.id !== resourceId || resource.sectionId !== sectionId)
    },
    deleteSectionResources: (state, action) => {
      const sectionId = action.payload
      return state.filter(resource => resource.sectionId !== sectionId)
    },
    updateResource: (state, action) => {
      const { resourceId, ...resource } = action.payload
        const index = state.findIndex(resource => resource.id === resourceId)
        if (index !== -1) {
          state[index] = { ...state[index], ...resource }
        }
    },
    updateResources: (state, action) => {
      return action.payload
    },
    reorderResources: (state, action) => {
      const { activeId, overId, sectionId } = action.payload
      //isolate the resources that belong to the specific section that will be reordered
      const sectionResources = state.filter(resource => resource.sectionId === sectionId)
      const otherResources = state.filter(resource => resource.sectionId !== sectionId)
    
      const oldIndex = sectionResources.findIndex(resource => resource.id === activeId)
      const newIndex = sectionResources.findIndex(resource => resource.id === overId)    
    
      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedItem] = sectionResources.splice(oldIndex, 1)
        sectionResources.splice(newIndex, 0, movedItem)
        return [...otherResources, ...sectionResources]
      }
      return state
    },
    resetResources: () => initialState
  },
})

export const { addResource, deleteResource, updateResource, updateResources, reorderResources, resetResources, deleteSectionResources } = resourcesSlice.actions

export default resourcesSlice.reducer