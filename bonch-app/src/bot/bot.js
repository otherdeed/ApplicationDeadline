const TelegramBot = require('node-telegram-bot-api');
const token = '7264730684:AAGjOJeyvq7XY6wfYugm3BDibHjlxhhQT1k';
const bot = new TelegramBot(token, { polling: true });

const groups = [];
const waitingForGroupInfo = {}; // Хранит состояние ожидания для каждого пользователя
const commands = [{
    command: "create",
    description: "Создать группу"
  },
  {
    command: "sing",
    description: "Присоединиться к группе"
  },
  {
    command: "leave",
    description: "Удалиться из группы"
  },
  {
    command: "group",
    description: "Посмореть мои группы"
  }
]
bot.setMyCommands(commands);
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Проверяем, является ли сообщение текстовым и не является ли оно командой
    if (msg.text) {
        if (msg.text === '/start') {
            bot.sendMessage(chatId, 'Привет! Это бот для создания и управления группами для дедлайнов.', {
                reply_markup: {
                    keyboard: [['Создать группу'], ['Присоединиться к группе'], ['Удалиться из группы']],
                    one_time_keyboard: true
                }
            });
        } else if (msg.text === 'Создать группу' || msg.text === '/create') {
            bot.sendMessage(chatId, 'Введите название группы:');
            waitingForGroupInfo[chatId] = { step: 'name' }; // Устанавливаем состояние ожидания
        } else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'name') {
            const nameGroup = msg.text.trim();
            waitingForGroupInfo[chatId].nameGroup = nameGroup; // Сохраняем название группы
            bot.sendMessage(chatId, 'Описание группы:');
            waitingForGroupInfo[chatId].step = 'desc'; // Переходим к следующему шагу
        } else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'desc') {
            const DescGroup = msg.text.trim();
            const nameGroup = waitingForGroupInfo[chatId].nameGroup; // Получаем название группы
            groups.push({
                name: nameGroup,
                description: DescGroup,
                creator: {
                    id: msg.from.id,
                    name: msg.from.first_name,
                    username: msg.from.username
                },
                members: [msg.from.id]
            });

            bot.sendMessage(chatId, 'Группа создана!');
            delete waitingForGroupInfo[chatId]; // Удаляем состояние ожидания
        } else if (msg.text === 'Присоединиться к группе' || msg.text === '/sing') {
            bot.sendMessage(chatId, 'Введите название группы для присоединения:');
            waitingForGroupInfo[chatId] = { step: 'join' }; // Устанавливаем состояние ожидания
        } else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'join') {
            const groupName = msg.text.trim();
            const group = groups.find(g => g.name === groupName);

            if (group) {
                if (!group.members.includes(msg.from.id)) {
                    group.members.push(msg.from.id); // Добавляем пользователя в группу
                    bot.sendMessage(chatId, `Вы присоединились к группе "${groupName}"!`);
                } else {
                    bot.sendMessage(chatId, `Вы уже находитесь в группе "${groupName}".`);
                }
            } else {
                bot.sendMessage(chatId, `Группа "${groupName}" не найдена.`);
            }
            delete waitingForGroupInfo[chatId]; // Удаляем состояние ожидания
        } else if (msg.text === 'Удалиться из группы' || msg.text === '/leave'  ) {
            bot.sendMessage(chatId, 'Введите название группы, из которой хотите удалить себя:');
            waitingForGroupInfo[chatId] = { step: 'leave' }; // Устанавливаем состояние ожидания
        } else if (waitingForGroupInfo[chatId] && waitingForGroupInfo[chatId].step === 'leave') {
            const groupName = msg.text.trim();
            const group = groups.find(g => g.name === groupName);

            if (group) {
                const memberIndex = group.members.indexOf(msg.from.id);
                if (memberIndex !== -1) {
                    group.members.splice(memberIndex, 1); // Удаляем пользователя из группы
                    bot.sendMessage(chatId, `Вы удалены из группы "${groupName}".`);
                } else {
                    bot.sendMessage(chatId, `Вы не находитесь в группе "${groupName}".`);
                }

                // Запрашиваем у создателя, хочет ли он удалить группу
                if (group.creator.id === msg.from.id) {
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
            } else {
                bot.sendMessage(chatId, `Группа "${groupName}" не найдена.`);
            }
            delete waitingForGroupInfo[chatId]; // Удаляем состояние ожидания
        } else if(msg.text === '/group'){
            await bot.sendMessage(chatId, 'Ваши группы:');
            const myGroups = groups.filter(g => g.members.includes(msg.from.id))
            console.log(myGroups); 
            await myGroups.map(g=> bot.sendMessage(chatId, `'${g.name}'`));
        }
    }
    console.log(groups);
    // console.log(waitingForGroupInfo);
});

// Обработка callback-кнопок
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    const data = query.data.split(':');

    if (data[0] === 'delete_group') {
        const groupName = data[1];
        const group = groups.find(g => g.name === groupName);

        if (group) {
            const index = groups.indexOf(group);
            if (index !== -1) {
                groups.splice(index, 1); // Удаляем группу
                bot.sendMessage(chatId, 'Группа удалена!');
            }
        }
    } else if (data[0] === 'keep_group') {
        bot.sendMessage(chatId, 'Вы продолжаете работать в группе.');
    }
    // Уведомляем Telegram о том, что callback был обработан
    bot.answerCallbackQuery(query.id);
});