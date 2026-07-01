import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * videosSlice
 * ------------
 * Fetches videos from the real backend API instead of mock data.
 * Supports optional category and search filters via query params.
 */

// GET /api/videos?category=Music&search=react
export const fetchVideos = createAsyncThunk(
     'videos/fetchVideos',
     async ({ category, search} = {}, {rejectWithValue}) =>{
        try{
            const params={}
            if(category && category !== 'All')  params.category = category
            if(search) params.search = search

            const {data} = await api.get('/videos', {params})
            return data
         } catch(error){
            return rejectWithValue(error.response?.data.message || 'Failed to fetch videos')
         }
     }
)

// POST /api/videos (protected)
export const createVideo = createAsyncThunk(
  'videos/createVideo',
  async (videoData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/videos', videoData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create video')
    }
  }
)

// PUT /api/videos/:id (protected)
export const updateVideo = createAsyncThunk(
  'videos/updateVideo',
  async ({ videoId, ...updates }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/videos/${videoId}`, updates)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update video')
    }
  }
)

// DELETE /api/videos/:id (protected)
export const deleteVideo = createAsyncThunk(
  'videos/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await api.delete(`/videos/${videoId}`)
      return videoId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video')
    }
  }
)

const videosSlice = createSlice({
  name: 'videos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = 'idle'
        state.items = action.payload
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        const index = state.items.findIndex((v) => v._id === action.payload._id)
        if (index !== -1) state.items[index] = action.payload
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.items = state.items.filter((v) => v._id !== action.payload)
      })
  },
})

export default videosSlice.reducer

