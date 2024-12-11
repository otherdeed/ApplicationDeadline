import axios from 'axios';
import './addDeadlineModal.css';
import React, { useState } from 'react';

function AddDeadlineModal({ isOpen, onClose, group }) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    
    async function addDeadline() {
        try {
            const response = await axios.post('http://localhost/src/server/routes/createDeadLine.php', {
                group_id: group.creator.group_id,
                subject: subject,
                description: description,
                deadline: deadline,
            });
            console.log('Дедлайн успешно добавлен:', response.data);
            console.log(response);
            // try {
            //     //window.location.reload();
            //     const notifyResponse = await axios.post('http://localhost:3001/sendDeadlineMess', {
            //         groupName: group.name,
            //         members: group.members // Исправлено: 'memebers' на 'members'
            //     });
            //     console.log('Уведомления успешно отправлены:', notifyResponse.data);
            // } catch (error) {
            //     console.error('Ошибка с POST sendDeadlineMess:', error.response ? error.response.data : error.message);
            //     alert('Ошибка при отправке уведомлений');
            //     return;
            // }
            window.location.reload();
        } catch (error) {
            console.error('Ошибка с POST addDeadline:', error.response ? error.response.data : error.message);
            alert('Ошибка при добавлении дедлайна');
            return;
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <form className='addDeadline' onSubmit={e => e.preventDefault()}>
                    <input placeholder='Предмет' value={subject} onChange={e => setSubject(e.target.value)} />
                    <input placeholder='Описание' value={description} onChange={e => setDescription(e.target.value)} />
                    <input placeholder='Дедлайн' value={deadline} onChange={e => setDeadline(e.target.value)} />
                    <button type="button" onClick={addDeadline}>Добавить</button>
                </form>
                <button onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

export default AddDeadlineModal;
