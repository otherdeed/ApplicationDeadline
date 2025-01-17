const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const { default: axios } = require('axios');
const app = express();
const PORT = 3001;
let clients = []; // Список клиентов, ожидающих сообщения

app.use(cors()); // Включаем CORS для всех маршрутов
app.use(express.json()); // Для парсинга JSON в теле запроса

const generateRandomId = (length = 5) => Math.random().toString(36).substring(2, 2 + length);

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'deadline_db' // Убедитесь, что это имя вашей базы данных
});

// Эндпоинт для long polling
app.get('/poll', (req, res) => {
    console.log('Клиент подключился для ожидания сообщений');
    clients.push(res); // Добавляем ответ клиента в массив
});

// Эндпоинт для создания нового пользователя
app.post('/newUser', (req, res) => {
    const user = req.body;
    const query = 'INSERT INTO users (tg_id, username, first_name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE username = ?, first_name = ?';
    pool.query(query, [user.tg_id, user.username, user.first_name, user.username, user.first_name], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        clients.forEach(client => {
            console.log(`Добавился новый юзер ${user.username}`);
            client.json(user); // Отправляем сообщение всем клиентам
        });
        res.sendStatus(200);
        clients = []; // Очищаем список после отправки
    });
});
app.post('/joinGroup', (req, res) => {
    const { id_group, tg_id } = req.body;
    // Проверяем, что переданы необходимые параметры
    if (!id_group || !tg_id) {
        return res.status(400).json({ error: 'id_group и tg_id обязательны' });
    }
    // Запрос для проверки существования группы
    const groupQuery = 'SELECT * FROM groups WHERE id_group = ?';
    pool.query(groupQuery, [id_group], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        // Если группа не найдена, возвращаем ошибку
        if (results.length === 0) {
            return res.status(404).json({ error: 'Группа не найдена' });
        }
        const membersGroup = 'SELECT * FROM group_members WHERE id_group = ?'
        pool.query(membersGroup, [id_group], (error, results) => {;
            const members = []
            results.forEach(member => {
                members.push(member.member);
            })
            if(members.includes(tg_id)){
                return res.status(400).json({ error: 'Вы уже являетесь участником данной группы' });
            }else{
                const typeGroupQuery = 'SELECT type FROM groups WHERE id_group = ?'
                pool.query(typeGroupQuery, [id_group], (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }
                    const typeGroup = results[0].type
                    if(typeGroup === 'public'){
                        const memberQuery = 'INSERT INTO group_members (member, id_group) VALUES (?, ?)';
                        pool.query(memberQuery, [tg_id, id_group], (error, results) => {
                            if (error) {
                                return res.status(500).json({ error: error.message });
                            }
                            // Возвращаем успешный ответ
                            res.status(200).json({ message: 'Вы успешно присоединились к группе' });
                        });
                    } else {
                        const userNameQuery = 'SELECT * FROM groups WHERE id_group = ?'
                        pool.query(userNameQuery, [id_group], (error, results) => {
                            if (error) {
                                console.error('Ошибка при выполнении запроса:', error);
                                return res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
                            }                        
                            console.log(results[0]);
                            const chatId = results[0].admin
                            const groupName = results[0].name
                            const userNameQuery = 'SELECT * FROM users WHERE tg_id = ?'
                            pool.query(userNameQuery, [tg_id], (error, results) => {
                                if (error) {
                                    console.error('Ошибка при выполнении запроса:', error);
                                    return res.status(500).json({ error: 'Ошибка при выполнении запроса к базе данных' });
                                }
                                const username = results[0].username
                                try{
                                    axios.post('http://localhost:3002/joinUserPriveGroup',{
                                        chatId: chatId,
                                        usernameMember:username,
                                        groupName: groupName,
                                        idMember:tg_id,
                                        id_group:id_group
                                    })
                                    return res.status(400).json({ error: 'Заявка на присоедение к приватной группе отправлена, как только создатель группы ответит на заявку, мы вам пришлем сообщение.' });
                                }catch(error){
                                    console.log('Error joininUserPriveGroup ' + error);
                                }
                            })
                        })
                    }
                })
            }
        })
    });
});
app.post('/actionJoinPrivateGroup', (req, res) => {
    const { action, tg_id, id_group } = req.body;
    console.log(id_group);
    
    if (action === 'approve') {
        const groupQuery = 'SELECT * FROM groups WHERE id_group = ?';
        
        // Проверяем наличие группы
        pool.query(groupQuery, [id_group], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            // Проверяем, существует ли группа
            if (results.length === 0) {
                return res.status(404).json({ error: 'Группа не найдена' });
            }

            const groupName = results[0].name;
            const memberQuery = 'INSERT INTO group_members (member, id_group) VALUES (?, ?)';
            
            pool.query(memberQuery, [tg_id, id_group], (error) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                res.json({ chatId: tg_id, message: `Вас добавили в группу "${groupName}"` });
            });
        });
    } else if (action === 'reject') {
        const groupQuery = 'SELECT * FROM groups WHERE id_group = ?';
        console.log(id_group);
        pool.query(groupQuery, [id_group], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }

            // Проверяем, существует ли группа
            if (results.length === 0) {
                return res.status(404).json({ error: 'Группа не найдена' });
            }
            const groupName = results[0].name;
            res.json({ chatId: tg_id, message: `Ваша заявка в группу "${groupName}" отклонена` });
        });
    } else {
        res.status(400).json({ error: 'Неверное действие' });
    }
});


// Эндпоинт для создания новой группы
app.post('/createNewGroup', (req, res) => {
    const { name, type, admin } = req.body;
    const id_group = generateRandomId(5);
    
    // Вставка новой группы
    const query = 'INSERT INTO groups (id_group, name, type, admin) VALUES (?, ?, ?, ?)';
    pool.query(query, [id_group, name, type, admin], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Создание папки по умолчанию
        const id_folder = generateRandomId(5);
        const folderQuery = 'INSERT INTO folders (id_folder, name, id_group) VALUES (?, ?, ?)';
        pool.query(folderQuery, [id_folder, 'new Folder', id_group], (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            // Добавление администратора в group_members
            const memberQuery = 'INSERT INTO group_members (member, id_group) VALUES (?, ?)';
            pool.query(memberQuery, [admin, id_group], (error, results) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                // Получаем список всех участников группы
                const members = [admin]; // Начинаем с администратора
                // Здесь можно добавить логику для добавления других участников, если это необходимо

                // Уведомление клиентов о создании новой группы
                res.json(id_group); // Возвращаем id группы и участников
                clients.forEach(client => {
                    console.log(`Добавилась новая группа ${name}`);
                    client.json(members); // Отправляем сообщение всем клиентам
                });
                clients = []; // Очищаем список после отправки
            });
        });
    });
});


// Эндпоинт для получения групп пользователя
app.post('/myGroups', (req, res) => {
    const { id } = req.body;

    // Запрос для получения групп, в которых состоит пользователь
    const groupsQuery = `
        SELECT * FROM groups 
        WHERE id_group IN (SELECT id_group FROM group_members WHERE member = ?)
    `;

    pool.query(groupsQuery, [id], (error, groupResults) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        const groups = [];
        let completedQueries = 0;

        // Проверяем, если есть группы
        if (groupResults.length === 0) {
            return res.json(groups); // Возвращаем пустой массив, если групп нет
        }

        // Обрабатываем каждую группу
        groupResults.forEach(group => {
            const groupId = group.id_group;

            // Запрос для получения членов группы
            const membersQuery = `
                SELECT member FROM group_members 
                WHERE id_group = ?
            `;

            pool.query(membersQuery, [groupId], (error, memberResults) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }

                // Запрос для получения папок группы
                const foldersQuery = `
                    SELECT * FROM folders 
                    WHERE id_group = ?
                `;

                pool.query(foldersQuery, [groupId], (error, folderResults) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }

                    // Формируем объект группы
                    const groupObject = {
                        id_group: group.id_group,
                        name: group.name,
                        type: group.type,
                        members: memberResults.map(member => member.member),
                        admin: group.admin,
                        folders: []
                    };

                    // Обрабатываем каждую папку
                    let completedFoldersQueries = 0;

                    folderResults.forEach(folder => {
                        const folderId = folder.id_folder;

                        // Запрос для получения дедлайнов папки
                        const deadlinesQuery = `
                            SELECT * FROM deadlines 
                            WHERE id_folder = ?
                        `;

                        pool.query(deadlinesQuery, [folderId], (error, deadlineResults) => {
                            if (error) {
                                return res.status(500).json({ error: error.message });
                            }

                            // Формируем объект папки
                            const folderObject = {
                                id_folder: folder.id_folder,
                                name: folder.name,
                                deadline: deadlineResults.map(deadline => ({
                                    id_deadline: deadline.id_deadline,
                                    name: deadline.name,
                                    due_date: deadline.due_date,
                                    description: deadline.description,
                                    priority: deadline.priority
                                }))
                            };

                            groupObject.folders.push(folderObject);
                            completedFoldersQueries++;

                            // Проверяем, завершены ли все запросы по папкам
                            if (completedFoldersQueries === folderResults.length) {
                                groups.push(groupObject);
                                completedQueries++;

                                // Проверяем, завершены ли все запросы по группам
                                if (completedQueries === groupResults.length) {
                                    return res.json(groups); // Возвращаем массив групп
                                }
                            }
                        });
                    });

                    // Если папок нет, просто добавляем группу
                    if (folderResults.length === 0) {
                        groups.push(groupObject);
                        completedQueries++;

                        // Проверяем, завершены ли все запросы по группам
                        if (completedQueries === groupResults.length) {
                            return res.json(groups); // Возвращаем массив групп
                        }
                    }
                });
            });
        });
    });
});



// Эндпоинт для создания новой папки
app.post('/createNewFolder', (req, res) => {
    const { id, folderName, members} = req.body;
    const id_folder = generateRandomId(5);
    const query = 'INSERT INTO folders (id_folder, name, id_group) VALUES (?, ?, ?)';
    
    pool.query(query, [id_folder, folderName, id], (error, results) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        res.sendStatus(200);
    });
    clients.forEach(client => {
        client.json(members); // Отправляем сообщение всем клиентам
        clients = [];
    });
});

// Эндпоинт для создания нового дедлайна
app.post('/newDeadline', (req, res) => {
    const { subject, description, deadline, priority, folderId, members } = req.body;

    console.log(req.body); // Логируем тело запроса

    // Проверка на наличие обязательных полей
    if (!subject || !description || !deadline || !priority || !folderId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const id_deadline = generateRandomId(5);
    const query = 'INSERT INTO deadlines (id_deadline, name, due_date, description, priority, id_folder) VALUES (?, ?, ?, ?, ?, ?)';
    
    console.log(query, [id_deadline, subject, deadline, description, priority, folderId]); // Логируем запрос

    pool.query(query, [id_deadline, subject, deadline, description, priority, folderId], (error, results) => {
        if (error) {
            console.error('SQL Error:', error); // Логируем ошибку SQL
            return res.status(500).json({ error: error.message });
        }

        clients.forEach(client => {
            client.json(members); // Отправляем сообщение всем клиентам
        });
        clients = [];
        res.sendStatus(200);
    });
});
app.post('/deleteFolder', (req, res) => {
    const { id_folder, members } = req.body;
    console.log(`Удаление папки с ID: ${id_folder}`);

    // Проверяем, что передан id_folder
    if (!id_folder) {
        return res.status(400).json({ error: 'id_folder обязателен' });
    }

    // Запрос для удаления дедлайнов, связанных с папкой
    const deleteDeadlinesQuery = 'DELETE FROM deadlines WHERE id_folder = ?';
    pool.query(deleteDeadlinesQuery, [id_folder], (error) => {
        if (error) {
            console.error('Ошибка при удалении дедлайнов:', error);
            return res.status(500).json({ error: error.message });
        }

        // Запрос для удаления папки
        const deleteFolderQuery = 'DELETE FROM folders WHERE id_folder = ?';
        pool.query(deleteFolderQuery, [id_folder], (error, results) => {
            if (error) {
                console.error('Ошибка при удалении папки:', error);
                return res.status(500).json({ error: error.message });
            }

            // Если папка успешно удалена, отправляем уведомления клиентам
            clients.forEach(client => {
                client.json(members); // Отправляем сообщение всем клиентам
            });
            clients = []; // Очищаем список клиентов
            res.sendStatus(200); // Возвращаем успешный статус
        });
    });
});
app.post('/leaveGroup', async (req, res) => {
    const { id_group, member } = req.body; // Получаем данные из тела запроса

    // Проверка на наличие необходимых данных
    if (!id_group || !member) {
        return res.status(400).json({ message: 'Group ID and member are required.' });
    }

    const memberQuery = 'SELECT * FROM groups WHERE id_group = ?';
    let isAdmin = false;

    // Проверка, является ли участник администратором группы
    pool.query(memberQuery, [id_group], async (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'An error occurred while checking group membership.' });
        }

        // Проверяем, есть ли группа с таким ID
        if (result.length === 0) {
            return res.status(200).json({ message: 'Такой группы не существует' });
        }

        // Проверяем, является ли участник администратором
        for (let i = 0; i < result.length; i++) {
            if (result[i].admin === member) {
                isAdmin = true; // Участник является администратором
                break; // Прерываем цикл, если нашли администратора
            }
        }

        // Если участник является администратором, отправляем сообщение
        if (isAdmin) {
            try {
                await axios.post('http://localhost:3002/messageDeleteGroup', {
                    message: 'Вы являетесь создателем группы, хотите её удалить?',
                    chatId: member,
                    id_group: id_group
                });
                console.log('Message sent to admin.');
                return res.status(200).json({ message: 'Message sent to admin.' });
            } catch (err) {
                console.error('Error sending message:', err);
                return res.status(500).json({ error: 'Failed to send message to admin.' });
            }
        } else {
            console.log(`${member} is not an admin of the group.`);
            // Здесь можно добавить логику для обычных участников
            // Например, удаление участника из группы
            const leaveGroupQuery = 'DELETE FROM group_members WHERE id_group = ? AND member = ?';
            pool.query(leaveGroupQuery, [id_group, member], (leaveError, leaveResult) => {
                if (leaveError) {
                    console.error('Error executing leave query:', leaveError);
                    return res.status(500).json({ error: 'An error occurred while leaving the group.' });
                }

                if (leaveResult.affectedRows === 0) {
                    return res.status(200).json({ message: 'Вы не являетесь учатсником группы' });
                }

                // Успешный выход из группы
                res.status(200).json({ message: 'Вы успешно удалились из группы' });
            });
        }
    });
});
app.post('/deleteDeadline',(req, res) => {
    const {deadlineId, members} = req.body
    const deleteDeadline  = 'DELETE FROM deadlines WHERE id_deadline = ?'
    pool.query(deleteDeadline, [deadlineId], (error, result) =>{
        if(error){
            console.error('Error executing query:', error)
            return res.status(500).json({error: 'An error occurred while deleting the deadline.'})
        }
        clients.forEach(client => {
            client.json(members); // Отправляем сообщение всем клиентам
        });
        clients = []; // Очищаем список клиентов
        res.status(200).json({message:'Дедлайн Удален'})
    })
})
app.post('/deleteGroup', (req, res) => {
    const { id_group } = req.body; // Получаем ID группы из тела запроса

    // SQL-запрос для удаления группы
    const deleteGroupQuery = 'DELETE FROM groups WHERE id_group = ?'; // Предполагается, что таблица называется 'groups' и поле 'id' является первичным ключом

    pool.query(deleteGroupQuery, [id_group], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.status(500).json({ error: 'An error occurred while deleting the group.' });
        }

        // Проверяем, была ли удалена хотя бы одна запись
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        // Успешное удаление
        res.status(200).json({ message: 'Ваша группа удалена' });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
