// const http = require('http');
// const url = require('url');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
// const groups = [];
// const users = [];

// // Создаем сервер
// const server = http.createServer((req, res) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

//     if (req.method === 'OPTIONS') {
//         res.writeHead(204);
//         return res.end();
//     }

//     const parsedUrl = url.parse(req.url, true);
//     const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
//     const method = req.method.toLowerCase();

//     if (method === 'get') {
//         if (path === 'groups') {
//             res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.end(JSON.stringify(groups));
//         } else {
//             res.writeHead(404);
//             res.end(JSON.stringify({ error: 'Не найдено' }));
//         }
//     }

//     if (method === 'post') {
//         let body = '';

//         req.on('data', chunk => {
//             body += chunk.toString();
//         });

//         req.on('end', () => {
//             let parsedBody;
//             try {
//                 parsedBody = JSON.parse(body);
//             } catch (error) {
//                 res.writeHead(400); // Bad Request
//                 return res.end(JSON.stringify({ error: 'Некорректный JSON' }));
//             }

//             if (path === 'newGroup') {
//                 groups.push(parsedBody);
//                 console.log('Groups:', groups);
//                 res.writeHead(201, { 'Content-Type': 'application/json' });
//                 return res.end(JSON.stringify({ message: 'Группа создана' }));
//             } else if (path === 'users') {
//                 users.push(parsedBody);
//                 console.log('Users:', users);
//                 res.writeHead(201, { 'Content-Type': 'application/json' });
//                 return res.end(JSON.stringify({ message: 'Пользователь добавлен' }));
//             } else if (path === 'joinUser ') {
//                 const { userId, groupName } = parsedBody;
//                 const group = groups.find(g => g.name === groupName);
//                 if (group) {
//                     if (!group.members) group.members = []; // Инициализация массива, если его нет
//                     group.members.push(userId);
//                     console.log('Groups:', groups);
//                     res.writeHead(200);
//                     return res.end(JSON.stringify({ message: 'Пользователь добавлен в группу' }));
//                 } else {
//                     res.writeHead(404);
//                     return res.end(JSON.stringify({ error: 'Группа не найдена' }));
//                 }
//             } else if (path === 'leaveUser ') { // Исправлено: убран лишний пробел
//                 const { userId, groupName } = parsedBody;
//                 const group = groups.find(g => g.name === groupName);
//                 if (group) {
//                     const memberIndex = group.members.indexOf(userId);
//                     if (memberIndex !== -1) {
//                         group.members.splice(memberIndex, 1);
//                         console.log('Groups:', groups);
//                         res.writeHead(200);
//                         return res.end(JSON.stringify({ message: 'Пользователь покинул группу' }));
//                     } else {
//                         res.writeHead(404);
//                         return res.end(JSON.stringify({ error: 'Пользователь не найден в группе' }));
//                     }
//                 }else {
//                     res.writeHead(404);
//                     return res.end(JSON.stringify({ error: 'Группа не найдена' }));
//                 }
//             } else if(path === 'sendDeadlineMess'){
//                 const {groupName, members} = parsedBody
//                 members.forEach(member => {
//                     bot.sendMessage(member, `Новый дедлайн в группе "${groupName}"`);
//                 })
//                 console.log('Groups:', groups);
//             }
//             else if (path === 'deleteGroup') {
//                 const { index } = parsedBody;
//                 if (index >= 0 && index < groups.length) {
//                     groups.splice(index, 1);
//                     console.log('Groups:', groups);
//                     res.writeHead(200);
//                     return res.end(JSON.stringify({ message: 'Группа успешно удалена' }));
//                 } else {
//                     res.writeHead(400);
//                     return res.end(JSON.stringify({ error: 'Некорректный индекс группы' }));
//                 }
//             } else if (path === 'sendMyGroups') {
//                 const { id } = parsedBody;
//                 const myGroups = groups.filter(g => g.members && g.members.includes(id));
//                 res.writeHead(200, { 'Content-Type': 'application/json' });
//                 return res.end(JSON.stringify(myGroups));
//             } else if (path === 'addDeadline') {
//                 const { groupName, deadline } = parsedBody;
//                 const group = groups.find(g => g.name === groupName);
//                 if (group) {
//                     if (!group.deadline) group.deadline = []; // Инициализация массива, если его нет
//                     group.deadline.push(deadline);
//                     console.log('Groups:', groups);
//                     res.writeHead(200);
//                     return res.end(JSON.stringify({ message: 'Дедлайн добавлен' }));
//                 } else {
//                     res.writeHead(404);
//                     return res.end(JSON.stringify({ error: 'Группа не найдена' }));
//                 }
//             }else if (path === 'deleteDeadline') {
//                 const {groupName, deadlineId} = parsedBody
//                 const group = groups.find(g => g.name === groupName);
//                 const newDeadline = group.deadline.filter(i => i.id !== deadlineId);
//                 group.deadline = newDeadline
//                 console.log('Groups:', groups);
//             } 
//             else {
//                 res.writeHead(404);
//                 return res.end(JSON.stringify({ error: 'Не найдено' }));
//             }
//         });
//     }

//     if (method === 'put') {
//         let body = '';

//         req.on('data', chunk => {
//             body += chunk.toString();
//         });

//         req.on('end', () => {
//             let parsedBody;
//             try {
//                 parsedBody = JSON.parse(body);
//             } catch (error) {
//                 res.writeHead(400); // Bad Request
//                 return res.end(JSON.stringify({ error: 'Некорректный JSON' }));
//             }

//             if (path === 'updateGroup') {
//                 const { groupName, updatedData } = parsedBody;
//                 const group = groups.find(g => g.name === groupName);
//                 if (group) {
//                     Object.assign(group, updatedData); // Обновляем свойства группы
//                     console.log('Groups:', groups);
//                     res.writeHead(200);
//                     return res.end(JSON.stringify({ message: 'Группа обновлена', group }));
//                 } else {
//                     res.writeHead(404);
//                     return res.end(JSON.stringify({ error: 'Группа не найдена' }));
//                 }
//             } else {
//                 res.writeHead(404);
//                 return res.end(JSON.stringify({ error: 'Не найдено' }));
//             }
//         });
//     }

//     if (method !== 'get' && method !== 'post' && method !== 'put') {
//         res.writeHead(405);
//         res.end(JSON.stringify({ error: 'Метод не разрешен' }));
//     }
// });

// // Запускаем сервер
// const PORT = 3001;
// server.listen(PORT, () => {
//     console.log(`Сервер запущен на http://localhost:${PORT}`);
// });


















const waitingForGroupInfo = {};
const commands = [
  { command: "create", description: "Создать группу" },
  { command: "sing", description: "Присоединиться к группе" },
  { command: "leave", description: "Удалиться из группы" },
  { command: "group", description: "Посмотреть мои группы" }
];

bot.setMyCommands(commands);

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    if(text === '/start') {
        try {
            await axios.post('http://localhost/src/server/routes/users.php', {
              id: msg.chat.id,
              name: msg.chat.first_name,
              username: msg.chat.username,
            });
            bot.sendMessage(chatId, 'Привет! Это бот для создания и управления группами для дедлайнов.', {
              reply_markup: {
                keyboard: [['Создать группу'], ['Присоединиться к группе'], ['Удалиться из группы']],
                one_time_keyboard: true
              }
            });
          } catch (error) {
            console.error('Error with POST NewUser:', error);
          }
    } else if(msg.text === 'Создать группу' || msg.text === '/create'){
        bot.sendMessage(chatId, 'Введите название группы:');
        waitingForGroupInfo[chatId] = { step: 'name' };
    } else if(waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'name'){
        const nameGroup = text.trim();
        waitingForGroupInfo[chatId].nameGroup = nameGroup;
        bot.sendMessage(chatId, 'Описание группы:');
        waitingForGroupInfo[chatId].step = 'desc';
    }else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'desc') {
        const DescGroup = msg.text.trim();
        const nameGroup = waitingForGroupInfo[chatId].nameGroup;
        try{
            const getGroups = await axios.get('http://localhost:3001/groups');
            const group = getGroups.data.find(g => g.name === nameGroup); 
            if(group){
                await bot.sendMessage(chatId,`Группа "${nameGroup}" с таким названием уже существует, создайте группу снова.`);
            } else{
                try {
                    const newGruop = await axios.post('http://localhost/src/server/routes/newGroup.php', {
                      name: nameGroup,
                      description: DescGroup,
                      creator: {
                        id: msg.from.id,
                        name: msg.from.first_name,
                        username: msg.from.username
                      },
                      z: [msg.from.id],
                      deadline:[]
                    });
                    console.log('POST Response:', newGruop.data);
                    bot.sendMessage(chatId, 'Группа создана!');
                  } catch (error) {
                    console.error('Error with POST newGroups:', error);
                  }
            }
        }catch (error) {
            console.error('Error with GET Groups:', error);
        }
          delete waitingForGroupInfo[chatId]; // Удаляем состояние ожидания
    }else if(text === 'Присоединиться к группе' || text === '/sing'){
        bot.sendMessage(chatId, 'Введите название группы для присоединения:');
        waitingForGroupInfo[chatId] = { step: 'join' }
    }else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'join') {
        const groupName = msg.text.trim();
        try{
            const getGroups = await axios.get('http://localhost:3001/groups');
            const group = getGroups.data.find(g => g.name === groupName);
            if(group){
                if(!group.members.includes(msg.from.id)){
                    try {
                        const joinGropus = await axios.post('http://localhost/src/server/routes/joinUser.php',{
                            groupName: groupName,
                            userId: msg.from.id
                        })
                        console.log('GET Response:', joinGropus.data);
                        bot.sendMessage(chatId, `Вы присоединились к группе "${groupName}"!`);
                    }catch (error) {
                         console.error('Error with GET JoinGroup:', error);
                    }
                } else{
                    bot.sendMessage(chatId, `Вы уже состоите в группе "${groupName}".`);
                }
            } else{
                bot.sendMessage(chatId, `Группа "${groupName}" не найдена.`);
            }
        }catch (error) {
            console.error('Error with GET GetGroups:', error);
        }
        delete waitingForGroupInfo[chatId];
    } else if(text === 'Удалиться из группы' || text === '/leave'){
        bot.sendMessage(chatId, 'Введите название группы для удаления:');
        waitingForGroupInfo[chatId] = { step: 'leave' }
    } else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'leave') {
        const groupName = msg.text.trim();
        try{
            const getGroups = await axios.get('http://localhost/src/server/routes/groups.php');
            const group = getGroups.data.find(g => g.name === groupName);
            if(group){
                const memberIndex = group.members.indexOf(msg.from.id);
                if (memberIndex !== -1) {   
                try{
                    const leaveUser = await axios.post('http://localhost/src/server/routes/deleteGroup.php',{
                        groupName: groupName,
                        userId: msg.from.id
                        })
                        bot.sendMessage(chatId, `Вы удалены из группы "${groupName}".`);
                        console.log('GET Response:', leaveUser.data);
                    }catch (error) {
                        console.error('Error with GET LeaveUser:', error);
                    }
                  } else {
                    bot.sendMessage(chatId, `Вы не находитесь в группе "${groupName}".`);
                  }

                  if(group.creator.id === msg.from.id){
                    bot.sendMessage(chatId, 'Вы хотите удалить группу?', {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: 'Да', callback_data: `delete_group:${groupName}` },
                                    { text: 'Нет', callback_data: 'keep_group' }
                                ]
                            ]
                        }
                    });
                  }
            } else{
                bot.sendMessage(chatId, `Группа "${groupName}" не найдена.`);
            }
            delete waitingForGroupInfo[chatId];
        }catch (error) {
            console.error('Error with GET GetGroups:', error);
        }
    }else if(msg.text === 'Посмотреть мои группы' || text === '/group'){
        try{
            const getGroups = await axios.get('http://localhost/src/server/routes/groups.php');
            const myGroups = getGroups.data.filter(g => g.members.includes(msg.from.id));
            await bot.sendMessage(chatId, 'Ваши группы:');
            await myGroups.map(g=> bot.sendMessage(chatId, `'${g.name}'`));
        } catch (error) {
            console.error('Error with GET GetMYGroups:', error);
        }
    }
})

bot.on('callback_query',async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data.split(':');
    if(data[0] === 'delete_group'){
        const groupName = data[1]
        try{
            const getGroups = await axios.get('http://localhost/src/server/routes/groups.php');
            const group = getGroups.data.find(g => g.name === groupName);
            if(group){
                const index = getGroups.data.indexOf(group)
                if(index!== -1){
                    try{
                        await axios.post('http://localhost/src/server/routes/deleteGroup.php',{
                            index: index
                        })
                        await bot.editMessageText(`Группа "${groupName}" удалена!`);
                    }catch (error) {
                        console.error('Error with POST DeleteGroup:', error);
                        return bot.answerCallbackQuery(query.id, 'Ошибка при удалении группы');
                    }
                }
            }else if (data[0] === 'keep_group') {
                bot.sendMessage(chatId, 'Вы продолжаете работать в группе.');
            }
        }catch (error) {
            console.error('Error with GET GetGroups:', error);
            return bot.answerCallbackQuery(query.id, 'Ошибка при получении группы');
        }
    }
})