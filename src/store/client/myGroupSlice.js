// userSlice.js
import { createSlice } from "@reduxjs/toolkit";
const myGroupSlice = createSlice({
    name: "myGruop",
    initialState: {
        id_group:null,
        name: null,
        type: null,
        members: [],
        admin: null,
        folders:[],
    },
    reducers: {
        setMyGroup : (state, action) => {
            state.id_group = action.payload.id_group;
            state.name = action.payload.name;
            state.type = action.payload.type;
            state.members = action.payload.members;
            state.admin = action.payload.admin;
            state.folders = action.payload.folders;
        },
    },
});

export const { setMyGroup, setActiveFolderId} = myGroupSlice.actions;
export default myGroupSlice.reducer;
