import { createSlice } from "@reduxjs/toolkit";

const myDeadlineSlice = createSlice({
    name: "myDeadline",
    initialState: {
        deadlines:[],
    },
    reducers: {
        setDeadlines: (state, actions) =>{
            state.deadlines = actions.payload;
        }
    },
});

export const {setDeadlines} = myDeadlineSlice.actions;
export default myDeadlineSlice.reducer;
