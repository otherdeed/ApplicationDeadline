import { configureStore } from '@reduxjs/toolkit';
import groupSlice from './client/groupSlice'; // Переименуйте на groupReducer для ясности
import userReducer from './client/userSlice';   // Переименуйте на userReducer для ясности
import myGroupSlice from './client/myGroupSlice'
import myDeadlineSlice from './client/myDeadlineSlice'
import filterSlice from './client/filterSlice'

const store = configureStore({
    reducer: {
        groups: groupSlice, 
        user: userReducer,  
        myGroup: myGroupSlice,
        myDeadlines: myDeadlineSlice,
        filter: filterSlice,
    },
});

export default store;