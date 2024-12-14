import React, { useState } from 'react';
import './main.css';
import OrderBlock from './orderBlock/orderBlock';
import AddDeadline from '../header/addDeadline/addDeadline';
import { useSelector } from 'react-redux';

function Main({ user }) {
    // Получаем данные из состояния Redux
    const groupName = useSelector(state => state.myGroup.name);
    const groups = useSelector(state => state.groups.groups);
    // Находим группу по имени
    const group = groups.find(g => g.name === groupName);
    const deadlines = group?.deadlines || []; // Используем опциональную цепочку
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для хранения текста поиска

    // Функция для обработки изменения текста в input
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Функция для фильтрации дедлайнов по subject
    const filteredDeadlines = deadlines
        .filter(deadline =>
            deadline.subject.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => new Date(a.due_date) - new Date(b.due_date)); // Сортировка по дате

    const renderDeadlines = () => {
        if (filteredDeadlines.length === 0) {
            return <div className='noDeadline'>Нет дедлайнов</div>; // Сообщение, если дедлайнов нет
        }
        return filteredDeadlines.map(deadline => (
            <OrderBlock
                key={deadline.id}
                id={deadline.id}
                subject={deadline.subject}
                deadline={deadline.due_date}
                description={deadline.description}
                isCompleted={deadline.isCompleted}
                group={group}
                creatorId={group?.creator?.id} // Используем опциональную цепочку
                userId={user.id}
            />
        ));
    };

    function renderAddDeadline() {
        if (group?.creator?.id === user.id) {
            return (
                <button className='fixed-button'>
                    <AddDeadline group={group} userId={user.id} />
                </button>
            );
        } else {
            return null;
        }
    }

    return (
        <div>
            <div className="main-container">
                <div className="order-container">
                    <input
                        type="text"
                        placeholder="Поиск"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {renderDeadlines()}
                </div>
                {renderAddDeadline()}
            </div>
        </div>
    );
}

export default Main;
