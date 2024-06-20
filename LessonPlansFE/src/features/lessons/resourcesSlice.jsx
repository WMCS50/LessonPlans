import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = []

export const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    addResource: (state, action) => {
      const { resource, sectionId } = action.payload
      const resourceWithId = { ...resource, id: uuidv4(), sectionId }
      state.push(resourceWithId)
    },
    
    deleteResource: (state, action) => {
      const { resourceId, sectionId } = action.payload
      return state.filter(resource => resource.id !== resourceId || resource.sectionId !== sectionId)
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
  }
})

export const { addResource, deleteResource, updateResources, reorderResources, resetResources } = resourcesSlice.actions

export default resourcesSlice.reducer