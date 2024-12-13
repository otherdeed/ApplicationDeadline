import React, { useState, useEffect } from 'react';
import './orderBlock.css';
import OrderModal from '../orderModal/orderModal';
import DeleteDeadline from '../deleteDeadline/deleteDeadline';
import axios from 'axios';

function OrderBlock({ group, id, subject, deadline, description, isCompleted, creatorId, userId }) {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isModalCloseOpen, setCloseModalOpen] = useState(false);
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
    function openCloseModal(){
        setCloseModalOpen(true)
    }
    function closeCloseModal(){
        setCloseModalOpen(false)
    }
    // Функция для удаления дедлайна
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
                if (difference < 3600000) { 
                    setBlockColor('black');
                } else {
                    setBlockColor('rgb(247 112 112)'); // Менее 1 дня
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
            <div className="order-block" style={{ backgroundColor: blockColor }}>
                <div className='deleteButton' onClick={openCloseModal} >
                    {creatorId === userId && (
                        <button>
                            <div>
                            <div class="icon">
                                <div class="cross"></div>
                            </div>
                                <DeleteDeadline onClose={closeCloseModal} isOpen={isModalCloseOpen} group={group} id={id}/>
                            </div>
                        </button>
                    )}
                </div>
                <div onClick={openOrderDesc}>
                    <div className="order-preview">{subject}</div>
                    <div className="order-price">{deadline}</div>
                    <div className="time-left">Осталось: {timeLeft}</div> {/* Отображаем оставшееся время */}
                </div>
            </div>
            <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} />
        </>
    );
}

export default OrderBlock;
