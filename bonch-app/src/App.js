import React, { useEffect,} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups } from './store/client/groupSlice';
import { setUser  } from './store/client/userSlice';
import { setMyGroup } from './store/client/myGroupSlice';
import './App.css';
import Header from './components/header/header';
import Main from './components/main/main';
//1875576355
function App() {
 const tg = window.Telegram.WebApp
  const dispatch = useDispatch();
  const user = {
    id: tg.initDataUnsafe.user?.id,
    username: tg.initDataUnsafe.user?.username,
    first_name: tg.initDataUnsafe.user?.first_name,
  };
  const myGroups = useSelector(state => state.groups.groups); // Получаем группы из Redux
  const group = useSelector(state => state.myGroup)
  useEffect(() => {
    dispatch(setUser(user)); // Сохраняем данные пользователя в Redux
    dispatch(fetchGroups(user.id)); // Передаем id пользователя в fetchGroups
  }, [dispatch]);

  useEffect(() => {
    // Устанавливаем первую группу или нулевую группу при изменении myGroups
    if (myGroups && Object.keys(myGroups).length > 0) {
      const firstGroup = Object.values(myGroups)[localStorage.getItem('group')] || Object.values(myGroups)[0] ; // Получаем первую группу
      dispatch(setMyGroup(firstGroup)); // Сохраняем выбранную группу в Redux
    }
  }, [myGroups]);
  if(user.id !== undefined){
    return (
      <div className="App">
        <Header group={group} user={user} myGroups={myGroups}/>
        <Main group={group} user={user}/>
      </div>
    );
  } else{
    return (
      <div className='App'>
       <div className='AppBrowse'><div>Сайт доступен только в телеграмме</div></div>
      </div>
    )
  }
}

export default App;
