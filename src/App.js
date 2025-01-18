import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroup } from './store/client/groupSlice';
import { setMyGroup } from './store/client/myGroupSlice';
import { setUser } from './store/client/userSlice';
import './App.css';
import axios from 'axios';
import Header from './components/header/header';
import Main from './components/main/main';
//1875576355
function App() {
  const tg = window.Telegram.WebApp
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.groups)
  const user = {
    id: tg.initDataUnsafe.user?.id || 1875576355,
    username: tg.initDataUnsafe.user?.username,
    first_name: tg.initDataUnsafe.user?.first_name,
  };
  const longPoll = () => {
    console.log('Отправка GET-запроса на /poll');

    axios.get('http://localhost:3001/poll') // Отправляем GET-запрос на сервер
      .then(response => {
        const members = response.data;
        if (members.includes(user.id)) {
          return axios.post('http://localhost:3001/myGroups', {
            id: user.id
          });
        }
        return null; // Возвращаем null, если условие не выполнено
      })
      .then(response => {
        if (response) { // Проверяем, был ли выполнен предыдущий запрос
          dispatch(setGroup(response.data));
        }
        longPoll(); // Запускаем long polling снова
      })
      .catch(err => {
        console.error('Ошибка при получении сообщения:', err);
        setTimeout(longPoll, 5000); // Повторяем запрос через 5 секунд в случае ошибки
      });
  };
  useEffect(() => {
    // Устанавливаем первую группу или нулевую группу при изменении myGroups
    if (groups && Object.keys(groups).length > 0) {
      const firstGroup = Object.values(groups)[localStorage.getItem('group')] || Object.values(groups)[0]; // Получаем первую группу
      dispatch(setMyGroup(firstGroup)); // Сохраняем выбранную группу в Redux      
    }
  }, [groups]);
  useEffect(() => {
    dispatch(setUser(user))
    axios.post('http://localhost:3001/myGroups', {
      id: user.id
    })
      .then(response => {
        dispatch(setGroup(response.data));
      })
    longPoll(); // Запускаем long polling при монтировании компонента
  }, []);
  if (user.id !== undefined) {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  } else {
    return (
      <div className='App'>
        <div className='AppBrowse'><div>Сайт доступен только в телеграмме</div></div>
      </div>
    )
  }
}

export default App;
