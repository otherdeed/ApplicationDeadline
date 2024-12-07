const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

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
            await axios.post('http://localhost:3001/users', {
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
                    const newGruop = await axios.post('http://localhost:3001/newGroup', {
                      name: nameGroup,
                      description: DescGroup,
                      creator: {
                        id: msg.from.id,
                        name: msg.from.first_name,
                        username: msg.from.username
                      },
                      members: [msg.from.id],
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
                        const joinGropus = await axios.post('http://localhost:3001/joinUser',{
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
            const getGroups = await axios.get('http://localhost:3001/groups');
            const group = getGroups.data.find(g => g.name === groupName);
            if(group){
                const memberIndex = group.members.indexOf(msg.from.id);
                if (memberIndex !== -1) {   
                try{
                    const leaveUser = await axios.post('http://localhost:3001/leaveUser',{
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
            const getGroups = await axios.get('http://localhost:3001/groups');
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
            const getGroups = await axios.get('http://localhost:3001/groups');
            const group = getGroups.data.find(g => g.name === groupName);
            if(group){
                const index = getGroups.data.indexOf(group)
                if(index!== -1){
                    try{
                        await axios.post('http://localhost:3001/deleteGroup',{
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