import { createSlice } from "@reduxjs/toolkit";
import {videos as mockVideos} from "../../data/videos"

/**
 * videosSlice
 * ------------
 * Holds all videos in the app. Seeded from mock data for now; once the
 * backend exists, this will be populated via a fetch thunk instead.
 *
 * Moving videos into Redux (instead of importing the mock array directly
 * in each component) means Channel page's add/edit/delete actions show
 * up immediately on the Home grid and Video Player too.
 */

const initialState = {
    items: mockVideos,  
}

const videosSlice = createSlice({
    name: 'videos',
    initialState,
    reducers: {
        addVideo(state,action){
            state.items.push(action.payload)
        },
        updateVideo(state,action){
            const index = state.items.findIndex((v) =>  v.videoId === action.payload.videoId)
            if(index !== -1){
                state.items[index] = {... state.items[index], ...action.payload}
            }
        },
        deleteVideo(state,action){
            state.items=state.items.filter((v)=> v.videoId  !== action.payload)
        },
    },
})

export const{addVideo, updateVideo, deleteVideo} = videosSlice.actions;
export default videosSlice.reducer