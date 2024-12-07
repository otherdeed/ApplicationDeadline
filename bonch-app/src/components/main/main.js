import React from 'react';
import './main.css';
import OrderBlock from './orderBlock/orderBlock';

function Main({group, user}){
    const deadlines = group.deadline || []
    
    const renderDeadlines = () => { 
        if (deadlines.length === 0) {
            return <div>Нет дедлайнов</div>; // Сообщение, если дедлайнов нет
        }
        return deadlines.map(deadline => (
            <OrderBlock 
                key={deadline.id}
                id={deadline.id}
                subject={deadline.subject}
                deadline={deadline.deadline}
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
            <div className="order-container">
                {renderDeadlines()}
            </div>
        </div>
    );
}

export default Main;
