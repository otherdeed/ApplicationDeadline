import React, { useState, useEffect } from 'react';
import './orderBlock.css';
import OrderModal from '../orderModal/orderModal';
import axios from 'axios';

function OrderBlock({ group, id, subject, deadline, description, isCompleted, creatorId, userId }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(''); // Состояние для оставшегося времени
    const [blockColor, setBlockColor] = useState(''); // Состояние для цвета блока

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
        console.log('дедлайн:', id);
        console.log('группа:', group.creator.group_id);
        try {
            const response = await axios.delete('http://localhost/src/server/routes/deleteDeadline.php', {
                data: {
                    groupId: group.creator.group_id,
                    deadlineId: id
                }
            });
            console.log('Delete Deadline:', response.data); 
            window.location.reload(); // Раскомментируйте, если хотите перезагрузить страницу
        } catch (error) {
            console.error('Ошибка при удалении дедлайна:', error);
        }
    }

    const Deadline = { id, subject, deadline, description, isCompleted };

    // Функция для вычисления оставшегося времени
    const calculateTimeLeft = () => {
        const deadlineDate = new Date(deadline); // Преобразуем строку в объект Date
        const now = new Date();
        const difference = deadlineDate - now; // Разница в миллисекундах

        // Если разница меньше 0, значит дедлайн прошел
        if (difference <= 0) {
            setTimeLeft('Время вышло'); // Сообщение, если дедлайн прошел
            setBlockColor('red'); // Цвет для прошедшего дедлайна
        } else {
            const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            if (daysLeft > 0) {
                setTimeLeft(`${daysLeft} дн`); // Если осталось больше дня
            } else {
                setTimeLeft(`${hoursLeft} ч`); // Если осталось меньше дня
                // Устанавливаем цвет в зависимости от оставшегося времени
                if (difference < 3600000) { // Менее 1 часа
                    setBlockColor('orange');
                } else {
                    setBlockColor('yellow'); // Менее 1 дня
                }
            }
        }
    };

    useEffect(() => {
        calculateTimeLeft(); // Вычисляем время при монтировании компонента
        const interval = setInterval(calculateTimeLeft, 3600000); // Обновляем каждую минуту

        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, [deadline]);

    return (
        <>
            {creatorId === userId && (
                <button onClick={deleteDeadline}>x</button>
            )}
            <div className="order-block" onClick={openOrderDesc} style={{ backgroundColor: blockColor }}>
                <div className="order-preview">{subject}</div>
                <div className="order-price">{deadline}</div>
                <div className="time-left">Осталось: {timeLeft}</div> {/* Отображаем оставшееся время */}
            </div>
            <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} />
        </>
    );
}

export default OrderBlock;
