import axios from 'axios';
import './addDeadlineModal.css'
import React,{useState} from 'react';
function AddDeadlineModal({ isOpen, onClose, group}) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    async function addDeadline(){
        try{
            await axios.post('http://localhost:3001/addDeadline', {
                groupName: group.name,
                deadline: { id: group.name , subject: subject, deadline: deadline, description: description, isCompleted: false }
            })
        } catch(error){
            console.error('Error with POST addDeadline:', error);
            alert('Ошибка при добавлении дедлайна');
            return;
        }
    }
    if (!isOpen) return null; 
    return(
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className='addDeadline' onSubmit={e => e.preventDefault()}>
                <input placeholder='Предмет'value={subject} onChange={e => setSubject(e.target.value)}/>
                <input placeholder='Описание'value={description} onChange={e => setDescription(e.target.value)}/>
                <input placeholder='Дедлайн'value={deadline} onChange={e => setDeadline(e.target.value)}/>
                <button onClick={addDeadline}>Добавить</button>
            </form>
            <button onClick={onClose}>Закрыть</button>
        </div>
    </div>
    )
}
export default AddDeadlineModal;