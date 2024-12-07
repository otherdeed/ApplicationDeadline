import { configureStore } from '@reduxjs/toolkit';
import groupSlice from './client/groupSlice'; // Переименуйте на groupReducer для ясности
import userReducer from './client/userSlice';   // Переименуйте на userReducer для ясности

const store = configureStore({
    reducer: {
        groups: groupSlice, // Используйте более описательное имя
        user: userReducer,     // Используйте более описательное имя
    },
});

export default store;
