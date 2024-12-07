import React from 'react';
import './orderModal.css';

function OrderModal({ isOpen, onClose, Deadline }) {   
    if (!isOpen) return null; 
    // Проверка на наличие Deadline
    if (!Deadline) {
        return (
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Ошибка</h2>
                    <p>Данные о дедлайне недоступны.</p>
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>{Deadline.subject}</h2>
                <p>Описание: {Deadline.description}</p>
                <p>Крайний срок: {Deadline.deadline}</p>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

export default OrderModal;
