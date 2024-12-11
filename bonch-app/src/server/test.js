const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Импортируем axios
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const waitingForGroupInfo = {};
const commands = [
    { command: "create", description: "Создать группу" },
    { command: "sing", description: "Присоединиться к группе" },
    { command: "leave", description: "Удалиться из группы" },
    { command: "group", description: "Посмотреть мои группы" },
    {command: "add", description:'Добавить дедлайн' },
  ];
  
  bot.setMyCommands(commands);
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        try {
            await axios.post('http://localhost/src/server/routes/users.php', {
                id: chatId,
                name: msg.from.first_name,
                username: msg.from.username,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            bot.sendMessage(chatId, 'Добро пожаловать! Управляйте своими дедлайнами с помощью групп.', {
                reply_markup: { keyboard: [['Создать группу'], ['Присоединиться к группе'], ['Удалиться из группы']], one_time_keyboard: true },
            });
        } catch (error) {
            console.error('Ошибка добавления пользователя:', error);
        }
    } else if (text === 'Создать группу' || text === '/create') {
        bot.sendMessage(chatId, 'Введите название группы:');
        waitingForGroupInfo[chatId] = { step: 'name' };
    } else if (waitingForGroupInfo[chatId]?.step === 'name') {
        waitingForGroupInfo[chatId].name = text.trim();
        bot.sendMessage(chatId, 'Введите описание группы:');
        waitingForGroupInfo[chatId].step = 'desc';
    } else if (waitingForGroupInfo[chatId]?.step === 'desc') {
        const { name } = waitingForGroupInfo[chatId];
        const description = text.trim();
        try {
            const newGroup = await axios.post('http://localhost/src/server/routes/newGroup.php', {
                name,
                description,
                creator: { id: chatId, name: msg.from.first_name, username: msg.from.username },
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            await bot.sendMessage(chatId, `Группа "${name}" успешно создана!`,{
                reply_markup: { 
                    inline_keyboard: [
                        [{text: 'sait', web_app:{url:'https://jp8v7k37-3000.euw.devtunnels.ms/'}}]
                    ]
                },
            });
            await bot.sendMessage(chatId, `Ваш уникальный id группы: ${newGroup.data.id}`);
        } catch (error) {
            console.error('Ошибка создания группы:', error);
            console.error('JSON parse error:', error);
        }
        delete waitingForGroupInfo[chatId];
    } else if (text === 'Присоединиться к группе' || text === '/sing') {
        bot.sendMessage(chatId, 'Введите ID группы, к которой хотите присоединиться:');
        waitingForGroupInfo[chatId] = { step: 'joinGroup' };
    } else if (waitingForGroupInfo[chatId]?.step === 'joinGroup') {
        const groupId = text.trim();
        try {
            await axios.put('http://localhost/src/server/routes/joinUser.php', {
                group_id: groupId,
                user_id: chatId,
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            bot.sendMessage(chatId, `Вы успешно присоединились к группе с ID: ${groupId}`);
        } catch (error) {
            console.error('Ошибка присоединения к группе:', error);
        }
        delete waitingForGroupInfo[chatId];
    }else if (text === 'Добавить дедлайн' || text === '/add') {
        bot.sendMessage(chatId, 'Введите ID группы, к которой хотите добавить дедлайн:');
        waitingForGroupInfo[chatId] = { step: 'addDeadline' };
    } else if (waitingForGroupInfo[chatId]?.step === 'addDeadline') {
        const groupId = text.trim();
        // Валидация groupId (можно добавить более сложную валидацию по вашим требованиям)
        if (!isNaN(groupId) && groupId > 0) {
            waitingForGroupInfo[chatId].groupId = groupId;
            bot.sendMessage(chatId, 'Введите название дедлайна:');
            waitingForGroupInfo[chatId].step = 'deadlineName';
        } else {
            bot.sendMessage(chatId, 'Пожалуйста, введите корректный ID группы.');
        }
    } else if(waitingForGroupInfo[chatId]?.step === 'deadlineName'){
        const deadlineName = text.trim();
        waitingForGroupInfo[chatId].deadlineName = deadlineName;
        bot.sendMessage(chatId, 'Придумайте описание дедлайна:');
        waitingForGroupInfo[chatId].step = 'deadlineDescription';
    }
    else if (waitingForGroupInfo[chatId]?.step === 'deadlineDescription') {
        const deadlineDescription = text.trim();
        waitingForGroupInfo[chatId].deadlineDescription = deadlineDescription;
        bot.sendMessage(chatId, 'Введите дату и время дедлайна (формат: YYYY-MM-DD):');
        waitingForGroupInfo[chatId].step = 'deadlineDate';
    } else if (waitingForGroupInfo[chatId]?.step === 'deadlineDate') {
        const deadlineDate = text.trim();
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;
        if (datePattern.test(deadlineDate)) {
            waitingForGroupInfo[chatId].deadlineDate = deadlineDate;
            try {
                const response = await axios.post('http://localhost/src/server/routes/getGroup.php', {
                    id: chatId // Передаем идентификатор пользователя
                });
                const myGruop = response.data.filter(group => group.creator.id === chatId);
                const groupID = []
                myGruop.forEach(element => {
                    groupID.push(String(element.creator.group_id));
                });
                if(groupID.includes(waitingForGroupInfo[chatId].groupId)){
                    try{
                        const response = await axios.post('http://localhost/src/server/routes/createDeadLine.php', {
                            group_id: waitingForGroupInfo[chatId].groupId,
                            subject: waitingForGroupInfo[chatId].deadlineName,
                            description: waitingForGroupInfo[chatId].deadlineDescription,
                            deadline: waitingForGroupInfo[chatId].deadlineDate,
                        });
                        console.log('Дедлайн успешно добавлен:', response.data);
                        bot.sendMessage(chatId, `Дедлайн "${waitingForGroupInfo[chatId].deadlineName}" добавлен в группу с ID: ${waitingForGroupInfo[chatId].groupId}!`);
                    }catch (error) {
                        console.error('Ошибка с POST addDeadline:', error.response ? error.response.data : error.message);
                        delete waitingForGroupInfo[chatId];
                    }
                }else{
                    bot.sendMessage(chatId, 'Вы не являетесь создателем группы с данным ID или некорректный ID группы.');
                }           
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
            console.log(waitingForGroupInfo[chatId]);            
            delete waitingForGroupInfo[chatId];
        } else {
            bot.sendMessage(chatId, 'Неверный формат даты. Пожалуйста, введите дату в формате YYYY-MM-DD.');
        }
    } 
    else if(text === 'Посмотреть мои группы' || text === '/group'){
        try{
            const response = await axios.post('http://localhost/src/server/routes/getGroup.php', {
                id: chatId // Передаем идентификатор пользователя
            });
            const myGruop = response.data.filter(group => group.creator.id === chatId);
            const otherGruop = response.data.filter(group => group.creator.id !== chatId);
            await bot.sendMessage(chatId, 'Ваши созданные группы:');
            myGruop.forEach(async element => {
                await bot.sendMessage(chatId, `${element.name} ID: ${element.creator.group_id}`)
            })
            bot.sendMessage(chatId,'Остальные группы:');
            otherGruop.forEach(async element=> {
                await bot.sendMessage(chatId, `${element.name} ID: ${element.creator.group_id}`)
            })
        }catch(error){
            console.error('Error fetching groups:', error);
        }
    }  
    else if (text === 'Удалиться из группы' || text === '/leave') {
        bot.sendMessage(chatId, 'Введите ID группы, из которой хотите удалиться:');
        waitingForGroupInfo[chatId] = { step: 'leaveGroup' };
    } else if (waitingForGroupInfo[chatId]?.step === 'leaveGroup') {
        const groupId = text.trim();
        try {
            await axios.delete('http://localhost/src/server/routes/deleteGroup.php', {
                headers: { 'Content-Type': 'application/json' },
                data: { 
                    id: groupId,
                    user_id: chatId,
                },
            });
            bot.sendMessage(chatId, `Группа с ID: ${groupId} успешно удалена!`);
        } catch (error) {
            console.error('Ошибка удаления из группы:', error);
        }
        delete waitingForGroupInfo[chatId];
    }
});
