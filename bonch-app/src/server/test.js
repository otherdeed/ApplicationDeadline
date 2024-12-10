const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios'); // Импортируем axios
require('dotenv').config();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

const waitingForGroupInfo = {};

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
    } else if (text === 'Создать группу') {
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
            await bot.sendMessage(chatId, `Группа "${name}" успешно создана!`);
            await bot.sendMessage(chatId, `Ваш уникальный id группы: ${newGroup.data.id}`);
        } catch (error) {
            console.error('Ошибка создания группы:', error);
            console.error('JSON parse error:', error);
        }
        delete waitingForGroupInfo[chatId];
    } else if (text === 'Присоединиться к группе') {
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
    } else if (text === 'Удалиться из группы') {
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
