import React, { useState } from 'react';
import './main.css';
import OrderBlock from './orderBlock/orderBlock';

function Main({ group, user }) {
    const deadlines = group.deadline || [];
    const [searchTerm, setSearchTerm] = useState(''); // Состояние для хранения текста поиска

    // Функция для обработки изменения текста в input
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Функция для фильтрации дедлайнов по subject
    const filteredDeadlines = deadlines.filter(deadline =>
        deadline.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderDeadlines = () => {
        if (filteredDeadlines.length === 0) {
            return <div>Нет дедлайнов</div>; // Сообщение, если дедлайнов нет
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
                creatorId={group.creator.id}
                userId={user.id}
            />
        ));
    };

    return (
        <div className="main-container">
            <input
                type="text"
                placeholder="Поиск по предмету..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="search-input"
            />
            <div className="order-container">
                {renderDeadlines()}
            </div>
        </div>
    );
}

export default Main;
