// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "groups",
    initialState: {
        groups:[],
        folderId: null,
    },
    reducers: {
        setGroup : (state, action) => {
            state.groups = action.payload;
        },
        setFolderID : (state, action) => {
            state.folderId = action.payload;
        },
    },
});

export const {setGroup ,setFolderID} = groupSlice.actions;
export default groupSlice.reducer;
