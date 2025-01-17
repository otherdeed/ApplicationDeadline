import React, { useState, useEffect } from 'react';
import './orderBlock.css';
import OrderModal from '../orderModal/orderModal';
import DeleteDeadline from '../deleteDeadline/deleteDeadline';
import axios from 'axios';
import { useSelector } from 'react-redux';

function OrderBlock({ group, id, name, deadline, description, admin}) {
    const userId = useSelector(state => state.user.id)
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
    const Deadline = { id, name, deadline, description};

    // Функция для вычисления оставшегося времени
    const calculateTimeLeft = () => {
        const deadlineDate = new Date(deadline); // Преобразуем строку в объект Date
        const now = new Date();
        const difference = deadlineDate - now; // Разница в миллисекундах

        // Если разница меньше 0, значит дедлайн прошел
        if (difference <= 0) {
            setTimeLeft('Время вышло'); // Сообщение, если дедлайн прошел
            setBlockColor('#8C2D2D'); // Цвет для прошедшего дедлайна
        } else {
            const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));

            if (daysLeft > 0) {
                setTimeLeft(`${daysLeft + 1} дн`); // Если осталось больше дня
            } else {
                setTimeLeft(`Завтра`); // Если осталось меньше дня
                // Устанавливаем цвет в зависимости от оставшегося времени
                if (difference < 3600000) { 
                    setBlockColor('#21779C');
                } else {
                    setBlockColor('#21779C'); // Менее 1 дня
                }
            }
        }
    };

    useEffect(() => {
        calculateTimeLeft(); // Вычисляем время при монтировании компонента
        const interval = setInterval(calculateTimeLeft, 3600000); // Обновляем каждую минуту

        return () => clearInterval(interval); // Очистка интервала при размонтировании
    }, [deadline]);

    function renderDateDeadline(deadline) {
        const months = [
            'января', 'февраля', 'марта', 'апреля', 
            'мая', 'июня', 'июля', 'августа', 
            'сентября', 'октября', 'ноября', 'декабря'
        ];
    
        const day = deadline.substring(8, 10);
        const monthIndex = parseInt(deadline.substring(5, 7), 10) - 1;
        if (monthIndex < 0 || monthIndex > 11) {
            throw new Error('Некорректная дата');
        }
        const month = months[monthIndex];
        return `${Number(day) + 1} ${month}`;
    }    
    
    return (
        <>
            <div className="order-block" style={{ backgroundColor: blockColor }}>
                {/* <div className='deleteButton' onClick={openCloseModal} >
                    {admin === userId && (
                        <button>
                            <div>
                            <div class="icon">
                                <div class="cross"></div>
                            </div>
                                <DeleteDeadline onClose={closeCloseModal} isOpen={isModalCloseOpen} group={group} id={id}/>
                            </div>
                        </button>
                    )}
                </div> */}
                <div onClick={openOrderDesc}>
                    <div className="order-preview">{name}</div>
                    <div className="order-price">{renderDateDeadline(deadline)}</div>
                    <div className="time-left">Осталось: {timeLeft}</div>
                </div>
            </div>
            <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} renderDateDeadline={renderDateDeadline} group={group} admin={admin}/>
        </>
    );
}

export default OrderBlock;

