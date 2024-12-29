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
        // window.location.reload();
        const datePattern = /^\d{4}-\d{2}-\d{2}$/
        if(datePattern.test(deadline) && description.length > 0 && subject.length > 0 && new Date(deadline) > new Date()){
            try {
                await axios.post('/server/routes/createDeadLine.php', {
                    group_id: group.creator.group_id,
                    subject: subject,
                    description: description,
                    deadline: deadline,
                });
                window.location.reload();
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
        <div className="modal-overlayDealine" onClick={onClose}>
            <div className="modal-contentDealine" onClick={(e) => e.stopPropagation()}>
                <form className='addDeadline' onSubmit={e => e.preventDefault()}>
                    <div className='inputBlock'>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_26_172)"><path d="M26.25 2.91663H8.74998C7.14581 2.91663 5.83331 4.22913 5.83331 5.83329V29.1666C5.83331 30.7708 7.14581 32.0833 8.74998 32.0833H26.25C27.8541 32.0833 29.1666 30.7708 29.1666 29.1666V5.83329C29.1666 4.22913 27.8541 2.91663 26.25 2.91663ZM8.74998 5.83329H16.0416V17.5L12.3958 15.3125L8.74998 17.5V5.83329Z" fill="#EFA31A"/></g><defs><clipPath id="clip0_26_172"><rect width="35" height="35" fill="white"/></clipPath></defs></svg>
                    <input
                        id='subject'
                        placeholder='Предмет' 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)} 
                    />
                    </div>
                    <div className='inputBlock'>
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_25_355)"><path d="M4.375 25.1562V30.625H9.84375L25.9729 14.4958L20.5042 9.02707L4.375 25.1562ZM30.2021 10.2667C30.7708 9.6979 30.7708 8.77915 30.2021 8.2104L26.7896 4.7979C26.2208 4.22915 25.3021 4.22915 24.7333 4.7979L22.0646 7.46665L27.5333 12.9354L30.2021 10.2667Z" fill="#EEA21B"/></g><defs><clipPath id="clip0_25_355"><rect width="35" height="35" fill="white"/></clipPath></defs></svg>
                    <input 
                        id='description' 
                        placeholder='Описание' 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                    />
                    </div>
                    <div className='inputBlock dateInput'>
                    <input
                        type='date'
                        id="deadline"
                        placeholder='Data' 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)} 
                    />
                    </div>
                    <button type="button" onClick={addDeadline}>Добавить дедлайн</button>
                </form>
                <div className="btnCloseModal"onClick={onClose}><div className='icon'><div className='cross'></div></div></div>
            </div>

        </div>
    );
}

export default AddDeadlineModal;
