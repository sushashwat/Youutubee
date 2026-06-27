import { createSlice } from '@reduxjs/toolkit'

/**
 * searchSlice
 * ------------
 * Holds the current search term, typed in the Header's search bar.
 * Lives in Redux (not local state) because Header and Home/VideoGrid
 * are separate components that both need access to it.
 */
const searchSlice = createSlice({
  name: 'search',
  initialState: { term: '' },
  reducers: {
    setSearchTerm(state, action) {
      state.term = action.payload
    },
  },
})

export const { setSearchTerm } = searchSlice.actions
export default searchSlice.reducer
