const http = require('http');
const url = require('url');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();

    if (method === 'post') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            let parsedBody;
            try {
                parsedBody = JSON.parse(body);
            } catch (error) {
                res.writeHead(400); // Bad Request
                return res.end(JSON.stringify({ error: 'Некорректный JSON' }));
            }

         
            if(path === 'sendDeadlineMess'){
                const {groupName, members} = parsedBody
                members.forEach(member => {
                    bot.sendMessage(member, `Новый дедлайн в группе "${groupName}"`);
                })
            }else {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'Не найдено' }));
            }
        });
    }
    if (method !== 'get' && method !== 'post' && method !== 'put') {
        res.writeHead(405);
        res.end(JSON.stringify({ error: 'Метод не разрешен' }));
    }
});

// Запускаем сервер
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});


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
            await bot.sendMessage(chatId, `👋 Привет! Добро пожаловать в **DeadlineMinder** — ваш надежный помощник в создании и управлении дедлайнов!\n\n🗓️ С нами вы сможете:\n- Легко отслеживать дедлайны\n- Создавать группы и присоединятся к ним \n- Получать напоминания о предстоящих дедлайнов\n\nЕсли у вас есть вопросы или вам нужна помощь, просто напишите /help, и я с радостью вам помогу!\n\nДавайте сделаем вашу продуктивность еще выше! 🚀`, {
                reply_markup: { keyboard: [['Создать группу'], ['Присоединиться к группе'], ['Удалиться из группы'],['Добавить дедлайн'],['Посмотреть мои группы']], one_time_keyboard: true },
            });
            await bot.sendMessage(chatId, 'Для начала создайте или присоединяйтесь к группе')
        } catch (error) {
            console.error('Ошибка добавления пользователя:', error);
        }
    } else if (text === 'Создать группу' || text === '/create') {
        bot.sendMessage(chatId, 'Придумайте название группы:');
        waitingForGroupInfo[chatId] = { step: 'name' };
    } else if (waitingForGroupInfo[chatId]?.step === 'name') {
        waitingForGroupInfo[chatId].name = text.trim();
        bot.sendMessage(chatId, 'Придумайте описание группы:');
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
            await bot.sendMessage(chatId, `Ваш уникальный ID группы: ${newGroup.data.id}`);
            await bot.sendMessage(chatId, 'ID группы нужен для новых участников, которые хотят присоединиться к вашей группе.');
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
        if (datePattern.test(deadlineDate) && new Date(deadlineDate) > new Date()) {
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
                        bot.sendMessage(chatId, `Дедлайн "${waitingForGroupInfo[chatId].deadlineName}" добавлен в группу с ID: ${waitingForGroupInfo[chatId].groupId}`);
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
            myGruop.forEach(async element => {
                await bot.sendMessage(chatId, `${element.name} ID: ${element.creator.group_id}`)
            })
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
            await axios.delete('http://localhost/scr/server/routes/deleteGroup.php', {
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
