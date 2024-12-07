try {
    const newGruop = await axios.post('http://localhost:3001/newGroup', {
      name: nameGroup,
      description: DescGroup,
      creator: {
        id: msg.from.id,
        name: msg.from.first_name,
        username: msg.from.username
      },
      members: [msg.from.id]
    });
    console.log('POST Response:', newGruop.data);
    bot.sendMessage(chatId, 'Группа создана!');
  } catch (error) {
    console.error('Error with POST newGroups:', error);
  }


  export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
    const response = await axios.post('http://localhost:3001/sendMyGroups',{
        id: useSelector(state => state.user.id)
    }); // Укажите правильный URL
    return response.data; // Предполагаем, что сервер возвращает массив групп
});