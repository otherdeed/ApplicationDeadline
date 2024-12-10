import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Создаем асинхронное действие для загрузки групп
export const fetchGroups = createAsyncThunk('groups/fetchGroups', async (userId) => {
    const response = await axios.post('http://localhost/src/server/routes/getGroup.php', {
        id: userId // Передаем идентификатор пользователя
    });
    return response.data; // Предполагаем, что сервер возвращает массив групп
});

const groupSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [], // Изменяем на объект групп
        loading: false,
        error: null,
    },
    reducers: {
        addStudent: (state, action) => {
            const { groupId, student } = action.payload;
            if (state.groups[groupId]) {
                state.groups[groupId].members.push(student);
            }
        },
        updateDeadline: (state, action) => {
            const { groupId, deadlineId, updatedDeadline } = action.payload;
            const group = state.groups[groupId];
            if (group) {
                const deadlineIndex = group.deadline.findIndex(d => d.id === deadlineId);
                if (deadlineIndex !== -1) {
                    group.deadline[deadlineIndex] = { ...group.deadline[deadlineIndex], ...updatedDeadline };
                }
            }
        },
        // Добавьте другие редюсеры по мере необходимости
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true; // Устанавливаем состояние загрузки
                state.error = null; // Сбрасываем ошибку
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false; // Устанавливаем состояние загрузки в false
                state.groups = action.payload; // Обновляем состояние групп
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false; // Устанавливаем состояние загрузки в false
                state.error = action.error.message; // Сохраняем сообщение об ошибке
            });
    },
});

// Экспортируйте действия
export const { addStudent, updateDeadline } = groupSlice.actions;

// Экспортируйте редюсер
export default groupSlice.reducer;
