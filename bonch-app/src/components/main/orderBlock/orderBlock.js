import React, { useState } from 'react';
import './orderBlock.css';
import OrderModal from '../orderModal/orderModal';
import axios from 'axios';

function OrderBlock({ group, id, subject, deadline, description, isCompleted, creatorId, userId }) {
    const [isModalOpen, setModalOpen] = useState(false);

    // Функция для открытия модального окна
    function openOrderDesc() {
        setModalOpen(true);
    }

    // Функция для закрытия модального окна
    function closeOrderDesc() {
        setModalOpen(false);
    }

    // Функция для удаления дедлайна
    async function deleteDeadline() {
        window.location.reload();
        try {
            await axios.post('http://localhost:3001/deleteDeadline', {
                groupName: group.name,
                deadlineId: id
            });
            // Перезагрузка страницы после успешного удаления
        } catch (error) {
            console.error('Ошибка при удалении дедлайна:', error);
        }
    }

    const Deadline = { id, subject, deadline, description, isCompleted };

    return (
        <>
            {creatorId === userId && (
                <button onClick={deleteDeadline}>x</button>
            )}
            <div className="order-block" onClick={openOrderDesc}>
                <div className="order-preview">{subject}</div>
                <div className="order-price">{deadline}</div>
            </div>
            <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} />
        </>
    );
}

export default OrderBlock;
