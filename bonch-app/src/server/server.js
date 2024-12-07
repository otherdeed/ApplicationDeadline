const http = require('http');
const url = require('url');

const groups = [];
const users = [];

// Создаем сервер
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

    if (method === 'get') {
        if (path === 'groups') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(groups));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ error: 'Не найдено' }));
        }
    }

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

            if (path === 'newGroup') {
                groups.push(parsedBody);
                console.log('Groups:', groups);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Группа создана' }));
            } else if (path === 'users') {
                users.push(parsedBody);
                console.log('Users:', users);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ message: 'Пользователь добавлен' }));
            } else if (path === 'joinUser ') {
                const { userId, groupName } = parsedBody;
                const group = groups.find(g => g.name === groupName);
                if (group) {
                    if (!group.members) group.members = []; // Инициализация массива, если его нет
                    group.members.push(userId);
                    console.log('Groups:', groups);
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Пользователь добавлен в группу' }));
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: 'Группа не найдена' }));
                }
            } else if (path === 'leaveUser ') { // Исправлено: убран лишний пробел
                const { userId, groupName } = parsedBody;
                const group = groups.find(g => g.name === groupName);
                if (group) {
                    const memberIndex = group.members.indexOf(userId);
                    if (memberIndex !== -1) {
                        group.members.splice(memberIndex, 1);
                        console.log('Groups:', groups);
                        res.writeHead(200);
                        return res.end(JSON.stringify({ message: 'Пользователь покинул группу' }));
                    } else {
                        res.writeHead(404);
                        return res.end(JSON.stringify({ error: 'Пользователь не найден в группе' }));
                    }
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: 'Группа не найдена' }));
                }
            } else if (path === 'deleteGroup') {
                const { index } = parsedBody;
                if (index >= 0 && index < groups.length) {
                    groups.splice(index, 1);
                    console.log('Groups:', groups);
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Группа успешно удалена' }));
                } else {
                    res.writeHead(400);
                    return res.end(JSON.stringify({ error: 'Некорректный индекс группы' }));
                }
            } else if (path === 'sendMyGroups') {
                const { id } = parsedBody;
                const myGroups = groups.filter(g => g.members && g.members.includes(id));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify(myGroups));
            } else if (path === 'addDeadline') {
                const { groupName, deadline } = parsedBody;
                const group = groups.find(g => g.name === groupName);
                if (group) {
                    if (!group.deadline) group.deadline = []; // Инициализация массива, если его нет
                    group.deadline.push(deadline);
                    console.log('Groups:', groups);
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Дедлайн добавлен' }));
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: 'Группа не найдена' }));
                }
            }else if (path === 'deleteDeadline') {
                const {groupName, deadlineId} = parsedBody
                const group = groups.find(g => g.name === groupName);
                const newDeadline = group.deadline.filter(i => i.id !== deadlineId);
                group.deadline = newDeadline
                console.log('Groups:', groups);
            } 
            else {
                res.writeHead(404);
                return res.end(JSON.stringify({ error: 'Не найдено' }));
            }
        });
    }

    if (method === 'put') {
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

            if (path === 'updateGroup') {
                const { groupName, updatedData } = parsedBody;
                const group = groups.find(g => g.name === groupName);
                if (group) {
                    Object.assign(group, updatedData); // Обновляем свойства группы
                    console.log('Groups:', groups);
                    res.writeHead(200);
                    return res.end(JSON.stringify({ message: 'Группа обновлена', group }));
                } else {
                    res.writeHead(404);
                    return res.end(JSON.stringify({ error: 'Группа не найдена' }));
                }
            } else {
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
