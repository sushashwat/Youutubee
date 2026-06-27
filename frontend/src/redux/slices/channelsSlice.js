import { createSlice } from "@reduxjs/toolkit";
import { channels as mockChannels } from "../../data/channels";

/**
 * channelsSlice
 * --------------
 * Holds all channels. Seeded from mock data; replaced by a fetch thunk
 * once the backend exists. addChannel is used by the "Create Channel"
 * page (only reachable when the user is signed in).
 */

const initialState = {
    items: mockChannels,
}

const channelsSlice = createSlice({
    name: 'channels',
    initialState,
    reducers: {
        addChannel(state,action){
            state.items.push(action.payload)
        },
    },

})

export const {addChannel} = channelsSlice.actions
export default channelsSlice.reducer

