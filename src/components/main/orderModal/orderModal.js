import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DeleteDeadline from '../deleteDeadline/deleteDeadline';
import './orderModal.css';

function OrderModal({ isOpen, onClose, Deadline , renderDateDeadline, group, admin}) {
    const userId = useSelector(state => state.user.id)
    const [isExiting, setIsExiting] = useState(false);
    const [timeLeft, setTimeLeft] = useState(''); // Состояние для оставшегося времени
    const [isModalCloseOpen, setCloseModalOpen] = useState(false);
    const { id, name, deadline, description } = Deadline
    function openCloseModal(){
        setCloseModalOpen(true)
    }
    function closeCloseModal(){
        setCloseModalOpen(false)
    }
    useEffect(() => {
        calculateTimeLeft(); // Вычисляем время при монтировании компонента
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen]);
    const calculateTimeLeft = () => {
        const deadlineDate = new Date(deadline); // Преобразуем строку в объект Date
        const now = new Date();
        const difference = deadlineDate - now; // Разница в миллисекундах

        // Если разница меньше 0, значит дедлайн прошел
        if (difference <= 0) {
            setTimeLeft('Время вышло'); // Сообщение, если дедлайн прошел
        } else {
            const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));

            if (daysLeft > 0) {
                setTimeLeft(`${daysLeft + 1} дн`); // Если осталось больше дня
            } else {
                setTimeLeft(`Завтра`); // Если осталось меньше дня
                // Устанавливаем цвет в зависимости от оставшегося времени
            }
        }
    };
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300);
    };

    if (!isOpen && !isExiting) return null;
    return (
        <div className={`modal-overlay ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='orderModal-text'>
                    <div className="order-preview">{name}</div>
                    <div className="order-price">Дата: {renderDateDeadline(deadline)}</div>
                    <div className="time-left">Осталось: {timeLeft}</div>
                    <div className='deskDead'><div>Описание:</div>{description}</div>
                </div>
                <div className='deleteButton' onClick={openCloseModal} >
                                    {admin === userId && (
                                        <button className='btnDel'>
                                            <div className='deleteDeadline'>
                                                Удалить дедлайн
                                                <DeleteDeadline onClose={closeCloseModal} isOpen={isModalCloseOpen} group={group} id={id}/>
                                            </div>
                                        </button>
                                    )}
                                </div>
                <div className="closeBtn" onClick={handleClose}>
                    <div className='icon'>
                        <div className='cross'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderModal;
