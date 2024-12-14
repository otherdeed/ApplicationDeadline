// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const myGroupSlice = createSlice({
    name: "myGruop",
    initialState: {
        name: null,
        description: null,
        deadline:[],
        creator:{},
        members: [],
    },
    reducers: {
        setMyGroup : (state, action) => {
            state.name = action.payload.name;
            state.description = action.payload.description;
            state.creator = action.payload.creator;
            state.members = action.payload.members;
            state.deadline = action.payload.deadline;
        },
    },
});

export const { setMyGroup} = myGroupSlice.actions;
export default myGroupSlice.reducer;
