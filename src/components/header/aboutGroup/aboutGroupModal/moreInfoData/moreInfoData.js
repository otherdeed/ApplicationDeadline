import './moreInfoData.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function MoreInfoData({ onClose, isOpen }) {
    const [isExiting, setIsExiting] = useState(false);
    const [users, setUsers] = useState([]); // Состояние для хранения пользователей
    const [loading, setLoading] = useState(true); // Состояние для загрузки
    const [error, setError] = useState(null); // Состояние для ошибок
    const myGroup = useSelector(state => state.myGroup);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300); // Должно совпадать с продолжительностью анимации
    };

    useEffect(() => {
        const fetchMoreData = async () => {
            try {
                const response = await axios.post('http://localhost:3001/fullListUsers', {
                    id_group: myGroup.id_group
                });
                setUsers(response.data); // Устанавливаем полученные данные в состояние
            } catch (err) {
                console.error('Ошибка при получении полной информации о пользователях:', err);
                setError('Ошибка при получении полной информации о пользователях');
            } finally {
                setLoading(false); // Устанавливаем загрузку в false после завершения запроса
            }
        };

        if (isOpen) { // Загружаем данные только если модальное окно открыто
            fetchMoreData();
        }
    }, [isOpen, myGroup.id_group]); // Зависимости для useEffect

    async function DeleteUser (tg_id) {
        if (tg_id === myGroup.admin) {
            alert('Вы не можете удалить себя(');
            return;
        }
        try {
            const res = await axios.post('http://localhost:3001/deleteUser ', {
                id_group: myGroup.id_group,
                tg_id: tg_id,
                members: myGroup.members,
                groupName: myGroup.name
            });

            if (res.status === 200) { // Проверяем статус ответа
                // Обновляем состояние, исключая удаленного пользователя
                setUsers(prevUsers => prevUsers.filter(user => user.id !== tg_id));
            }
        } catch (err) {
            console.error('Ошибка при удалении пользователя:', err);
            alert('Не удалось удалить пользователя. Попробуйте еще раз.');
        }
    }

    if (!isOpen && !isExiting) return null;

    return (
        <div className={`modal-overlay ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
            <div
                className={`modal-con ${isExiting ? 'fade-out' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                {loading ? (
                    <div className='usersDataEr'>Загрузка...</div>
                ) : error ? (
                    <div className='usersDataEr'>{error}</div>
                ) : (
                    users.map(item => (
                        <div className='usersData' key={item.id}>
                            <div>ID: <b>{item.id}</b></div>
                            <div>Username: <b>@{item.username}</b></div>
                            <button onClick={() => DeleteUser (item.id)}>
                                {myGroup.admin === item.id ? 'Это вы)' : 'Удалить пользователя'}
                            </button>
                        </div>
                    ))
                )}
                <div className="CloseBtn" onClick={handleClose}>
                    <div className='Icon'>
                        <div className='cross'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MoreInfoData;
