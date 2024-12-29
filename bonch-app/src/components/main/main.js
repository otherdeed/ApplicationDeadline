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
                <div className='search-container'>
                        <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="search-input"
                        />
                        <svg className='search-icon' width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.3125 15.25H16.2262L15.8413 14.8787C17.1888 13.3112 18 11.2762 18 9.0625C18 4.12625 13.9987 0.125 9.0625 0.125C4.12625 0.125 0.125 4.12625 0.125 9.0625C0.125 13.9987 4.12625 18 9.0625 18C11.2762 18 13.3112 17.1888 14.8787 15.8413L15.25 16.2262V17.3125L22.125 24.1737L24.1737 22.125L17.3125 15.25ZM9.0625 15.25C5.63875 15.25 2.875 12.4862 2.875 9.0625C2.875 5.63875 5.63875 2.875 9.0625 2.875C12.4862 2.875 15.25 5.63875 15.25 9.0625C15.25 12.4862 12.4862 15.25 9.0625 15.25Z" fill="#EEA21B"/>
                        </svg>
                    </div>
                    {renderDeadlines()}
                </div>
                {renderAddDeadline()}
            </div>
        </div>
    );
}

export default Main;
