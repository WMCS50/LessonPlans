import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const initialState = []

/* export const saveResource = createAsyncThunk('resources/saveResource',
  async (resource, { rejectWithValue }) => {
    try {
      const response = await axios
        .put(`http://localhost:3001/resources/${resource.id}`, resource)
        console.log('resource saved', response.data)
        return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
) */

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
    updateResource: (state, action) => {
      const { resourceId, ...resource } = action.payload
/*       const resource = state.find((res) => res.id === resourceId)
      if (resource) {
        resource.content = content
      } */
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
/*   extraReducers: (builder) => {
    builder
      .addCase(saveResource.fulfilled, (state, action) => {
        const index = state.findIndex(resource => resource.id === action.payload.id)
        if (index !== -1) {
          state[index] = action.payload
        }
      })
  } */
})

export const { addResource, deleteResource, updateResource, updateResources, reorderResources, resetResources } = resourcesSlice.actions

export default resourcesSlice.reducer
