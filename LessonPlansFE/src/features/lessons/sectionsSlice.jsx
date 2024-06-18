import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const initialState = []

export const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    addSection: (state, action) => {
      const { section } = action.payload
      const sectionWithId = { ...section, id: uuidv4() }
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

/*tried and failed with this:
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { current } from 'immer'

// Fetch sections
export const fetchSections = createAsyncThunk('lessons/fetchSections',
  async (lessonId) => {
    const response = await axios.get(`http://localhost:3001/lessons/${lessonId}/sections`)
    return response.data
  }
)

//Add section
export const addSection = createAsyncThunk('sections/addSection',
  async ({ lessonId, section }) => {
    const response = await axios.post(`http://localhost:3001/lessons/${lessonId}/sections`, { ...section, id: uuidv4() })
    return response.data
  }
)

//Update section
export const updateSection = createAsyncThunk('sections/updateSection',
  async ({ lessonId, sectionId, section }) => {
    const response = await axios.put(`http://localhost:3001/lessons/${lessonId}/sections/${sectionId}`, section)
    return response.data
  }
)

// Delete section
export const deleteSection = createAsyncThunk('lessons/deleteSection',
  async ({ lessonId, sectionId }) => {
    await axios.delete(`http://localhost:3001/lessons/${lessonId}/sections/${sectionId}`)
    return sectionId
  }
)

const initialState = {
  sections: [],
  status: 'idle',
  error: null
}

// Create slice
const sectionsSlice = createSlice({
  name: 'sections',
  initialState,
  reducers: {
    sectionAdded: (state, action) => {
      state.lessons.push(action.payload)
    },
    sectionDeleted: (state, action) => {
      state.lessons = state.sections.filter(section => section.id !== action.payload)
    },
    reorderSections: (state, action) => {
      const { activeId, overId } = action.payload
      console.log('state.sections before reorder:', current(state.sections));
      
      const oldIndex = state.sections.findIndex(section => section.id === activeId)
      const newIndex = state.sections.findIndex(section => section.id === overId)      
      console.log('Old Index:', oldIndex);
      console.log('New Index:', newIndex);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const [movedItem] = state.sections.splice(oldIndex, 1)
        state.sections.splice(newIndex, 0, movedItem)
      }
      console.log('state.sections after reorder:', current(state.sections))
    },
    resetSections: (state) => {
      state.sections = initialState.sections
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        console.log('Fetched sections:', action.payload)
        state.sections = action.payload
        state.status = 'succeeded'
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.error = action.payload
        state.status = 'failed'
      })
      .addCase(addSection.fulfilled, (state, action) => {
        console.log('Added section:', action.payload)
        state.sections.push(action.payload);
        state.status = 'succeeded'
      })
      .addCase(addSection.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.lessons = state.sections.filter(section => section.id !== action.payload);
        state.status = 'succeeded'
      })
      .addCase(deleteSection.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.section.findIndex(section => section.id === action.payload.id)
        index !== -1 ? state.section[index] = action.payload : null
        state.status = 'succeeded'
      })
      .addCase(updateSection.rejected, (state, action) => {
        state.error(action.payload)
        state.status = 'failed'
      })
  }
})

export const { sectionAdded, sectionDeleted, reorderSections, resetSections } = sectionsSlice.actions
export default sectionsSlice.reducer
*/