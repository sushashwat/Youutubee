import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../api/axios';

/**
 * authSlice
 * ----------
 * Handles register/login via the real backend, and persists the JWT +
 * user info in localStorage so the session survives a page refresh.
 * initialState reads from localStorage on app load, so a returning
 * user is "remembered" without needing to log in again.
 */

const storedUser = localStorage.getItem('user')

const initialState = {
  user: storedUser? JSON.parse(storedUser) : null,
  isAuthenticated: !! storedUser,
  status: 'idle', // 'idle' | 'loading' | 'failed'
  error: null,
 }

// POST /api/auth/register
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

// POST /api/auth/login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'idle'
        const { token, ...user } = action.payload
        state.user = user
        state.isAuthenticated = true
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'idle'
        // Per assignment spec: after successful registration, redirect
        // to login (handled in Signup.jsx) - we don't auto-login here.
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer


