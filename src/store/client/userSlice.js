// userSlice.js
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        id: null,
        username: null,
        first_name: null,
    },
    reducers: {
        setUser : (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.first_name = action.payload.first_name;
        },
    },
});

export const { setUser} = userSlice.actions;
export default userSlice.reducer;
