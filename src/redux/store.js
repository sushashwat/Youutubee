import { configureStore } from "@reduxjs/toolkit";
import authReducer from './slices/authSlice'
import videosReducer from './slices/videosSlice'
import channelsReducer from './slices/channelsSlice'
import searchReducer from './slices/searchSlice'
import { Search } from "lucide-react";

export const store  = configureStore({
    reducer:{
        auth:authReducer,
        videos:videosReducer,
        channels:channelsReducer,
        search:searchReducer,
    },
})