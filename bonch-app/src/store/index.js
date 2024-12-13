import { configureStore } from '@reduxjs/toolkit';
import groupSlice from './client/groupSlice'; // Переименуйте на groupReducer для ясности
import userReducer from './client/userSlice';   // Переименуйте на userReducer для ясности
import myGroupSlice from './client/myGroupSlice'

const store = configureStore({
    reducer: {
        groups: groupSlice, 
        user: userReducer,  
        myGroup: myGroupSlice
    },
});

export default store;
