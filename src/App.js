import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGroup } from './store/client/groupSlice';
import { setMyGroup } from './store/client/myGroupSlice';
import { setUser  } from './store/client/userSlice';
import { setPollstatus } from './store/client/serverInfoSlice';
import './App.css';
import axios from 'axios';
import Header from './components/header/header';
import Main from './components/main/main';

function App() {
  const tg = window.Telegram.WebApp;
  const dispatch = useDispatch();
  const groups = useSelector(state => state.groups.groups);
  const serverStatus = useSelector(state => state.serverInfo.pollStatus)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  const user = {
    id: tg.initDataUnsafe.user?.id || 1875576355,
    username: tg.initDataUnsafe.user?.username,
    first_name: tg.initDataUnsafe.user?.first_name,
  };

  const longPoll = () => {
    console.log('Отправка GET-запроса на /poll');
    axios.get('http://localhost:3001/poll')
      .then(response => {
        const members = response.data;
        if (members.includes(user.id)) {
          return axios.post('http://localhost:3001/myGroups', { id: user.id });
        }
        return null;
      })
      .then(response => {
        if (response) {
          dispatch(setGroup(response.data));

          setError(null)
          setError(null); // Сбрасываем ошибку при успешном подключени
          setIsConnected(true); // Устанавливаем состояние подключения в true
        }
        longPoll(); // Запускаем long polling снова
      })
      .catch(err => {
        console.error('Ошибка при получении сообщения:', err.message);
        setError('Не удалось подключиться к серверу.'); // Устанавливаем состояние ошибки
        dispatch(setPollstatus('server Disconnected'));
        setIsConnected(false); // Устанавливаем состояние подключения в false
        setTimeout(longPoll, 5000); // Повторяем запрос через 5 секунд в случае ошибки
    
      });
  };
  function getGroup(){
    axios.post('http://localhost:3001/myGroups', { id: user.id })
      .then(response => {
        dispatch(setPollstatus('server Connection'));
        dispatch(setGroup(response.data));
        setLoading(false); // Устанавливаем состояние загрузки в false после получения данных
      })
      .catch(error => {
        console.error('Ошибка при получении списка групп:', error.message);
        setError('Не удалось получить группы.'); // Устанавливаем состояние ошибки
        setLoading(false); // Устанавливаем состояние загрузки в false, даже если произошла ошибка
        dispatch(setPollstatus('server Disconnected'));
        if(!isConnected){
          setTimeout(getGroup, 5000);
        }
      });
  }
  function renderServerConnection(){
    if(serverStatus === 'server Disconnected'){
      return <div className='ErrorServer errorActive'>{serverStatus}</div>
    }
    if(serverStatus === 'server Connection'){
      return <div className='ErrorServer'>{serverStatus}</div>
    }
  }
  useEffect(() => {
    if (groups && Object.keys(groups).length > 0) {
      const firstGroup = Object.values(groups)[localStorage.getItem('group')] || Object.values(groups)[0];
      dispatch(setMyGroup(firstGroup));
    }
  }, [groups]);

  useEffect(() => {
    dispatch(setUser (user));
    getGroup()
    longPoll(); // Запускаем long polling при монтировании компонента
  }, [isConnected,serverStatus]);
  if (loading) {
    return (
      <div className='App'>
        <div className='LoadApp'>Загрузка...</div>
      </div>
    ); // Показываем индикатор загрузки
  }
  if(user.id === undefined){
    return(
      <div className='App'>
        <div className='LoadApp'>Cайт работает только в телеграме</div>
      </div>
    )
  }
  return (
    <div className="App">
      <Header />
      <Main />
    </div>
  );
}

export default App;
