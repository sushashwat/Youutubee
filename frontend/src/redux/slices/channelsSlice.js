import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/**
 * channelsSlice
 * --------------
 * Fetches the current user's channel from the backend.
 * Used by the Header to show "Your channel" vs "Create channel" link.
 */

export const fetchMyChannel = createAsyncThunk(
  'channels/fetchMyChannel',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/channels/mine')
      return data
    } catch (error) {
      return rejectWithValue(null)
    }
  }
)

export const addChannel = createAsyncThunk(
  'channels/addChannel',
  async (channelData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/channels', channelData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create channel')
    }
  }
)

const channelsSlice = createSlice({
    name: 'channels',
    initialState:{
        myChannel: null,
        items:[],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchMyChannel.fulfilled, (state,action)=> {
            state.myChannel = action.payload
            if(action.payload){
                state.items=[action,payload]
            }
        })
        .addCase(addChannel.fulfilled, (state,action) => {
             state.myChannel = action.payload
             state.items = [action.payload]  
        })
    },

})

export default channelsSlice.reducer

