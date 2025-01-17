import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
    name: "filter",
    initialState: {
        searchTerm: '',
        searchTime: 1,
        searchPriority: null,
        isOpenFilter: true
    },
    reducers: {
        setTerm : (state, action) => {
            state.searchTerm = action.payload;
        },
        setTime : (state, action) => {
            state.searchTime = Number(action.payload)
        },
        setPriority : (state, action) => {
            state.searchPriority = action.payload;
        },
        setIsopenFilter : (state, action) => {
            state.isOpenFilter = action.payload
        }
    },
});

export const {setTerm , setTime, setPriority, setIsopenFilter} = filterSlice.actions;
export default filterSlice.reducer;
