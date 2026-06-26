import {createSlice} from '@reduxjs/toolkit';

/**
 * authSlice
 * ----------
 * Holds the currently logged-in user's info across the whole app.
 * NOTE: mock/local-only auth for now (no backend call yet). Once the
 * backend exists, login/logout will also handle JWT tokens (storing/
 * removing from localStorage so login survives a page refresh).
 */

const initialState = {
  user: null, // { username, email } once logged in
  isAuthenticated: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer