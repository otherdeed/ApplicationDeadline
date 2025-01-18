import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
    name: "groups",
    initialState: {
        groups: [],
        folderId: null,
    },
    reducers: {
        setGroup: (state, action) => {
            const newGroups = action.payload; // Получаем массив новых групп
            newGroups.forEach(updatedGroup => {
                const index = state.groups.findIndex(group => group.id_group === updatedGroup.id_group);
                
                if (index !== -1) {
                    // Если группа существует, обновляем ее
                    state.groups[index] = updatedGroup;
                } else {
                    // Если группы нет, добавляем новую
                    state.groups.push(updatedGroup);
                }
            });
        },
        setFolderID: (state, action) => {
            state.folderId = action.payload;
        },
    },
});

export const { setGroup, setFolderID } = groupSlice.actions;
export default groupSlice.reducer;
