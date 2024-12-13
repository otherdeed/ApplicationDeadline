import axios from 'axios';
import './addDeadlineModal.css';
import React, { useState, useEffect} from 'react';

function AddDeadlineModal({ isOpen, onClose, group }) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    useEffect(() => {
        const deadlineInput = document.getElementById('deadline')
        deadlineInput?.classList.remove('error');
    }, [deadline, subject, description]);
    async function addDeadline() {
        window.location.reload();
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        if(datePattern.test(deadline) && description.length > 0 && subject.length > 0 && new Date(deadline) > new Date()){
            try {
                await axios.post('https://deadlineminder.ru/server/routes/createDeadLine.php', {
                group_id: group.creator.group_id,
                subject: subject,
                description: description,
                deadline: deadline,
                });
                // try{
                //     await axios.post('http://localhost:3001/sendDeadlineMess', {
                //         groupName: group.name,
                //         members: group.members
                //     })
                // }catch (error) {
                //     console.error('Ошибка с POST sendDeadlineMess:', error);
                //     alert('Ошибка при отправик сообщения');
                //     return;
                // }
                } catch (error) {
                    console.error('Ошибка с POST addDeadline:', error.response ? error.response.data : error.message);
                    alert('Ошибка при добавлении дедлайна');
                    return;
                }   
        }
        if(description === ''){
            const descriptionInput = document.getElementById('description');
            descriptionInput.style.border = '2px solid red';
        }
        if(subject === ''){
            const subjectInput = document.getElementById('subject');
            subjectInput.style.border = '2px solid red';
        }
        if(!datePattern.test(deadline) ||  new Date(deadline) < new Date()){
            const deadlineInput = document.getElementById('deadline');
            deadlineInput.classList.add('error');
            deadlineInput.style.border = '2px solid red';
        }
    }

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className='modal-text'>
                    <div>Добавление</div>
                    <div>дедлайна</div>
                </div>
                <form className='addDeadline' onSubmit={e => e.preventDefault()}>
                    <input
                        id='subject'
                        placeholder='Предмет' 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)} 
                    />
                    <input 
                        id='description' 
                        placeholder='Описание' 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                    />
                    <input className='lastInput'
                        id="deadline"
                        placeholder='Data' 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)} 
                    />
                    <div className='data'>формат: гггг-дд-нн</div>
                    <button type="button" onClick={addDeadline}>Добавить</button>
                </form>
                <button className="close-button" onClick={onClose}>Закрыть</button>
            </div>

        </div>
    );
}

export default AddDeadlineModal;
