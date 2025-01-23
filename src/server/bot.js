const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const Imap = require('imap');
const { simpleParser } = require('mailparser');
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3002;
// Настройки IMAP
const imap = new Imap({
    user: process.env.USERMAIL, // Ваша почта
    password: process.env.PASSWORDMAIL, // Ваш пароль или App Password
    host: process.env.HOSTMAIL, // IMAP сервер
    port: 993,
    tls: true
});

let processedEmails = new Set(); // Множество для хранения идентификаторов обработанных писем

function openInbox(cb) {
    imap.openBox('INBOX', true, cb);
}

// Функция для проверки новых сообщений
function checkForNewEmails() {
    imap.once('ready', () => {
        openInbox((err, box) => {
            if (err) throw err;

            // Подписка на новые сообщения
            imap.on('mail', (numNewMail) => {
                fetchNewEmails();
            });
        });
    });

    imap.connect();
}

// Функция для получения и обработки новых сообщений
function fetchNewEmails() {
    imap.search(['UNSEEN'], (err, results) => {
        if (err) throw err;

        if (results.length) {
            const f = imap.fetch(results, { bodies: '' });
            f.on('message', (msg) => {
                msg.once('attributes', (attrs) => {
                    const emailId = attrs.uid; // Получаем уникальный идентификатор письма

                    // Если письмо уже обработано, пропускаем его
                    if (processedEmails.has(emailId)) {
                        return;
                    }

                    msg.on('body', (stream, info) => {
                        simpleParser(stream, async (err, parsed) => {
                            if (err) throw err;

                            // Отправляем сообщение в Telegram
                            // Добавляем идентификатор письма в множество обработанных
                            processedEmails.add(emailId);
                        });
                    });
                });
            });

            f.once('end', async () => {
                console.log('Все новые сообщения обработаны.');
                await bot.sendMessage(process.env.ADMINTELEGRAMID, 'Пользователь отправил сообщение на почту');
            });
        } else {
            console.log('Нет новых сообщений.');
        }
    });
}
checkForNewEmails()


app.use(cors());
app.use(express.json());

const waitingForGroupInfo = {};
const commands = [
    { command: "create", description: "Создать группу" },
    { command: "join", description: "Присоединиться к группе" },
    { command: "leave", description: "Удалиться из группы" },
    { command: "group", description: "Посмотреть мои группы" },
    { command: "help", description: "Поддержка" },
];

bot.setMyCommands(commands);

// Защита от спама
const rateLimit = {};
const TIME_WINDOW = 1000; // Время окна в миллисекундах (1 секунда)
const MAX_REQUESTS = 5; // Максимальное количество запросов за время окна
const userBlockList = {};
const BLOCK_TIME = 60000; // Время блокировки в миллисекундах (1 минута)

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Проверка на блокировку
    if (userBlockList[chatId]) {
        const blockExpiration = userBlockList[chatId];
        const currentTime = Date.now();
        if (currentTime < blockExpiration) {
            bot.sendMessage(chatId, 'Вы временно заблокированы за спам. Пожалуйста, подождите.');
            return;
        } else {
            delete userBlockList[chatId]; // Удаляем блокировку, если время истекло
        }
    }

    // Ограничение частоты запросов
    if (!rateLimit[chatId]) {
        rateLimit[chatId] = { requests: 0, lastRequestTime: Date.now() };
    }

    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - rateLimit[chatId].lastRequestTime;

    // Сброс счетчика, если время окна истекло
    if (timeSinceLastRequest > TIME_WINDOW) {
        rateLimit[chatId].requests = 1;
        rateLimit[chatId].lastRequestTime = currentTime;
    } else {
        rateLimit[chatId].requests++;
    }

    // Проверка превышения лимита
    if (rateLimit[chatId].requests > MAX_REQUESTS) {
        userBlockList[chatId] = Date.now() + BLOCK_TIME; // Устанавливаем время блокировки
        bot.sendMessage(chatId, 'Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.');
        return;
    }

    // Ваш существующий код обработки сообщений
    if (text === '/start') {
        try {
            await axios.post('http://localhost:3001/newUser ', {
                tg_id: chatId,
                first_name: msg.from.first_name,
                username: msg.from.username,
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            await bot.sendMessage(chatId, `👋 Привет! Добро пожаловать в **DeadlineMinder** — ваш надежный помощник в создании и управлении дедлайнами!`, {
                reply_markup: { keyboard: [['Создать группу 🌟👫'], ['Присоединиться к группе 🤗🔗'], ['Удалиться из группы ❌🚶‍♂️'], ['Посмотреть мои группы 👁️📑'],['Написать в поддержку 🛠️📞']], one_time_keyboard: true },
            });

        } catch (error) {
            console.error('Ошибка добавления пользователя:', error);
        }
    } else if (text === 'Создать группу 🌟👫' || text === '/create') {
        try{
            const myGroups = await axios.post('http://localhost:3001/myGroups', {
                id: chatId
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            const countGroup = myGroups.data.length;
            if (countGroup >= 8) {
                bot.sendMessage(chatId, 'Вы достигли лимита групп. Максимум 8 групп.');
            } else {
                bot.sendMessage(chatId, 'Придумайте название группы:');
                waitingForGroupInfo[chatId] = { step: 'name' };
            }
        } catch(error){
            console.error('Ошибка получения списка моих групп:', error);
        }
    } else if (waitingForGroupInfo[chatId]?.step === 'name') {
        waitingForGroupInfo[chatId].name = text.trim();
        if(waitingForGroupInfo[chatId].name.length > 12){
            bot.sendMessage(chatId, 'Слишком длинное название, название не должно превышать длину 12 символом.');
            return;
        }
        await bot.sendMessage(chatId, `Какой тип группы вы хотите?`, {
            reply_markup: { keyboard: [['Публичный'], ['Приватный']], one_time_keyboard: true },
        });
        waitingForGroupInfo[chatId].step = 'type';
    } else if (waitingForGroupInfo[chatId]?.step === 'type') {
        const { name } = waitingForGroupInfo[chatId];
        let type = text.trim();
        if (type === 'Публичный') {
            type = 'public';
        } else if (type === 'Приватный') {
            type = 'private';
        }
        try {
            const newGroup = await axios.post('http://localhost:3001/createNewGroup', {
                name,
                type,
                admin: chatId,
            },{
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            await bot.sendMessage(chatId, `Группа "${name}" успешно создана!\n\nВаш уникальный ID группы: ${newGroup.data}\n\nОн нужен для новых участников, которые хотят присоединиться к вашей группе.`,{
                reply_markup: { keyboard: [['Создать группу 🌟👫'], ['Присоединиться к группе 🤗🔗'], ['Удалиться из группы ❌🚶‍♂️'], ['Посмотреть мои группы 👁️📑'],['Написать в поддержку 🛠️📞']] },
            });
        } catch (error) {
            console.error('Ошибка создания группы:', error);
            bot.sendMessage(chatId, 'Произошла ошибка при создании группы.');
        }
        delete waitingForGroupInfo[chatId];
    } else if (text === '/help' || text === 'Написать в поддержку 🛠️📞') {
        const responseMessage = `
        Привет! 👋\n\nЕсли у вас есть вопросы или вам нужна помощь, не стесняйтесь обращаться к нам! \n\n📧 Вы можете написать нам на почту: help@deadlineminder.ru\n\n💬 Или свяжитесь с нами через Telegram: @deadlineminder`;
        await bot.sendMessage(chatId, responseMessage);
    }
    else if (text === 'Присоединиться к группе 🤗🔗' || text === '/join') {
        bot.sendMessage(chatId, 'Введите ID группы, к которой хотите присоединиться:');
        waitingForGroupInfo[chatId] = { step: 'joinGroup' };
    } else if (waitingForGroupInfo[chatId]?.step === 'joinGroup') {
        try{
            const myGroups = await axios.post('http://localhost:3001/myGroups', {
                id: chatId
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            const countGroup = myGroups.data.length;
            if (countGroup >= 8) {
                await bot.sendMessage(chatId, 'Вы достигли лимита созданных групп. Пожалуйста, удалите ненужные группы.');
                return;
            } else {
                const groupId = text.trim();
                try {
                    await axios.post('http://localhost:3001/joinGroup', {
                        id_group: groupId,
                        tg_id: chatId
                    }, {
                        headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
                    });
                    await bot.sendMessage(chatId, `Вы успешно присоединились к группе с ID: ${groupId}`);
                } catch (error) {
                    await bot.sendMessage(chatId, error.response.data.error);
                }
                delete waitingForGroupInfo[chatId];
            }
        }catch (error) {
            console.error('Ошибка получения списка моих групп:', error);
            await bot.sendMessage(chatId, 'Произошла ошибка при попытке присоединиться к группе.');
        }
    } else if (text === 'Посмотреть мои группы 👁️📑' || text === '/group') {
        try {
            const response = await axios.post('http://localhost:3001/myGroups', {
                id: chatId,
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            if(response.data.length === 0){
                bot.sendMessage(chatId, 'У вас нет групп.');
                return;
            }
            response.data.forEach(async group => {
                await bot.sendMessage(chatId, `Группа: ${group.name}\nID: ${group.id_group}`,{
                    reply_markup: { keyboard: [['Создать группу 🌟👫'], ['Присоединиться к группе 🤗🔗'], ['Удалиться из группы ❌🚶‍♂️'], ['Посмотреть мои группы 👁️📑'],['Написать в поддержку 🛠️📞']] },
                });
            });
        } catch (error) {
            console.error('Error fetching groups:', error);
            await bot.sendMessage(chatId, 'Произошла ошибка при попытке получить список ваших групп.');
        }
    } else if (text === 'Удалиться из группы ❌🚶‍♂️' || text === '/leave') {
        bot.sendMessage(chatId, 'Введите ID группы, из которой хотите удалиться:');
        waitingForGroupInfo[chatId] = { step: 'leaveGroup' };
    } else if (waitingForGroupInfo[chatId]?.step === 'leaveGroup') {
        const groupId = text.trim();
        try {
            const res = await axios.post('http://localhost:3001/leaveGroup', {
                id_group: groupId,
                member: chatId,
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });
            bot.sendMessage(chatId, res.data.message);
        } catch (error) {
            console.error('Ошибка удаления из группы:', error);
            await bot.sendMessage(chatId, 'Произошла ошибка при попытке удалиться из группы.');
        }
        delete waitingForGroupInfo[chatId];
    }
});

bot.on('callback_query', async (call) => {
    const data = JSON.parse(call.data);
    if (data.action === 'approve' || data.action === 'reject') {
        try {
            const response = await axios.post('http://localhost:3001/actionJoinPrivateGroup', {
                action: data.action,
                tg_id: data.idMember,
                id_group: data.id_group
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });

            const { chatId, message } = response.data;
            await bot.sendMessage(chatId, message);
            await bot.editMessageText('Пользователь увидит ваш ответ.',{
                chat_id: call.message.chat.id,
                message_id: call.message.message_id,
            });
            console.log(call);
            
        } catch (error) {
            console.error('Error in actionJoinPrivateGroup:', error.message);
            await bot.sendMessage(call.from.id, 'Произошла ошибка при обработке вашего запроса.');
        }
    }

    if (data.action === 'approveDeleteGroup') {
        try {
            const res = await axios.post('http://localhost:3001/deleteGroup', {
                id_group: data.id_group
            }, {
                headers: { 'Content-Type': 'application/json' ,'Origin': 'http://bot-req' },
            });

            if (res.data) {
                const { message } = res.data;
                bot.editMessageText(message,{
                    chat_id: call.message.chat.id,
                    message_id: call.message.message_id,
                });
            } else {
                console.log('No data received from deleteGroup');
            }
        } catch (error) {
            console.error('Error in deleteGroup:', error.message);
            await bot.sendMessage(call.from.id, 'Произошла ошибка при удалении группы.');
        }
    }

    if (data.action === 'rejectDeleteGroup') {
        await bot.editMessageText('Ваша группа остается',{
            chat_id: call.message.chat.id,
            message_id: call.message.message_id,
        });
    }
});

app.post('/joinUserPriveGroup', async (req, res) => {
    const { chatId, idMember, groupName, usernameMember, id_group } = req.body;
    await bot.sendMessage(chatId, `пользователь @${usernameMember} хочет присоединиться к вашему группе "${groupName}"`, {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Добавить', callback_data: JSON.stringify({ action: 'approve', idMember: idMember, id_group: id_group }) },
                { text: 'Не добавлять', callback_data: JSON.stringify({ action: 'reject', idMember: idMember, id_group: id_group }) }
            ]]
        }
    });
});

app.post('/messageDeleteGroup', async (req, res) => {
    const { message, chatId, id_group } = req.body;
    await bot.sendMessage(chatId, message, {
        reply_markup: {
            inline_keyboard: [[
                { text: 'Удалить', callback_data: JSON.stringify({ action: 'approveDeleteGroup', id_group: id_group }) },
                { text: 'Не Удалять', callback_data: JSON.stringify({ action: 'rejectDeleteGroup' }) }
            ]]
        }
    });
});
app.post('/createDeadline', (req, res) => {
    const {members, nameGroup} = req.body;
    members.forEach(async (member) => {
        await bot.sendMessage(member, `В группе "${nameGroup}" появился новый дедлайн`)
    })
})

app.post('/trackDeadline', (req, res) => {
    const {data} = req.body
    const sortData = new Set()
    data.forEach(d => {
        sortData.add(d)
    })
    console.log(Array.from(sortData));
    Array.from(sortData).forEach(async d =>{
        await bot.sendMessage(d.member, `В группе "${d.group}" завтра заканчивается дедлайн`)
    })

})
app.post('/groupDelete', (req, res) => {
    const {members, groupName} = req.body;
    members.forEach(async (member) => {
        await bot.sendMessage(member, `Группа "${groupName}" была удалена`)
    })
})
app.post('/userDeleteGroup', async (req, res) => {
    const {tg_id, groupName} = req.body;
    await bot.sendMessage(tg_id, `Вы были удалены с группы "${groupName}"`)
})
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
