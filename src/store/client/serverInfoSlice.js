import { createSlice } from "@reduxjs/toolkit";
const serverInfoSlice = createSlice({
    name: "serverInfo",
    initialState: {
        pollStatus:''
    },
    reducers: {
        setPollstatus : (state, action) => {
            state.pollStatus = action.payload
        },
    },
});

export const { setPollstatus} = serverInfoSlice.actions;
export default serverInfoSlice.reducer;
