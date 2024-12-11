import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from './store/client/groupSlice';
import { setUser  } from './store/client/userSlice';
import './App.css';
import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';

function App() {
 const tg = window.Telegram.WebApp
  const [group, setGroup] = useState({
    name: null,
    description: null,
    creator: null,
    members: [],
    deadline:[]
  });
  console.log(group);
  const dispatch = useDispatch();
  const user = {
    id: tg.initDataUnsafe.user?.id || 1875576355,
    username: tg.initDataUnsafe.user?.username,
    first_name: tg.initDataUnsafe.user?.first_name,
  };
  const myGroups = useSelector(state => state.groups.groups); // Получаем группы из Redux

  useEffect(() => {
    dispatch(setUser(user)); // Сохраняем данные пользователя в Redux
    dispatch(fetchGroups(user.id)); // Передаем id пользователя в fetchGroups
  }, [dispatch]);

  useEffect(() => {
    // Устанавливаем первую группу или нулевую группу при изменении myGroups
    if (myGroups && Object.keys(myGroups).length > 0) {
      const firstGroup = Object.values(myGroups)[0]; // Получаем первую группу
      setGroup(firstGroup); // Устанавливаем выбранную группу
    }
  }, [myGroups]);

  async function changeGroup(name) {
    const selectedGroup = Object.values(myGroups).find(group => group.name === name);
    if (selectedGroup) {
      setGroup(selectedGroup); // Устанавливаем выбранную группу
    }
  }
  if(user.id !== undefined){
    return (
      <div className="App">
        <Header group={group} user={user} />
        {Object.values(myGroups).map(group => (
          <button key={group.name} onClick={() => changeGroup(group.name)}>
            {group.name}
          </button>
        ))}
        <Main group={group} user={user}/>
        <Footer />
      </div>
    );
  } else{
    return (
      <div className='App'>
        Сайт доступен только в телеграмме
      </div>
    )
  }
}

export default App;
