import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './deleteDeadline.css'
import axios from 'axios';
function DeleteDeadline({ onClose, isOpen, id, group }) {  
    const [isExiting, setIsExiting] = useState(false);
    const myGroupMembers = useSelector(state => state.myGroup.members);
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }

        return () => {
            document.body.classList.remove("no-scroll");
        };
    }, [isOpen]);
    async function deleteDeadline() {
        try {
            await axios.post('http://localhost:3001/deleteDeadline', {
                members: myGroupMembers,
                deadlineId: id
            });
        } catch (error) {
            console.error('Ошибка при удалении дедлайна:', error);
        }
    }
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
            <div className="DeleteText" onClick={(e) => e.stopPropagation()}>
                Удалить дедлайн?
                <div className='BtnDelete'>
                    <button onClick={deleteDeadline}>Да</button>
                    <button onClick={handleClose}>Нет</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteDeadline;