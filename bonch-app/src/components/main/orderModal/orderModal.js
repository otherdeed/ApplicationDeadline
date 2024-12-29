import React, {useState} from 'react';
import './orderModal.css';
import DeleteDeadline from '../deleteDeadline/deleteDeadline';

function OrderModal({ isOpen, onClose, Deadline, group, id, creatorId, userId, timeLeft}) {
    const [isModalCloseOpen, setCloseModalOpen] = useState(false);   
    function openCloseModal() {
        setCloseModalOpen(true);
      }
      function closeCloseModal() {
        setCloseModalOpen(false);
      }
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
                <div className='subject'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_129)"><path d="M2.25 12.9375V15.75H5.0625L13.3575 7.45498L10.545 4.64248L2.25 12.9375ZM15.5325 5.27998C15.825 4.98748 15.825 4.51498 15.5325 4.22248L13.7775 2.46748C13.485 2.17498 13.0125 2.17498 12.72 2.46748L11.3475 3.83998L14.16 6.65248L15.5325 5.27998Z" fill="#EEA21B"/></g><defs><clipPath id="clip0_0_129"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>{Deadline.subject}</div>
                <div className='deadlineDate'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_128)"><path d="M15 2.25H14.25V0.75H12.75V2.25H5.25V0.75H3.75V2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V15.75C1.5 16.575 2.175 17.25 3 17.25H15C15.825 17.25 16.5 16.575 16.5 15.75V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 15.75H3V7.5H15V15.75ZM15 6H3V3.75H15V6Z" fill="#EEA21B"/></g><defs><clipPath id="clip0_0_128"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>{Deadline.deadline}</div>
                <div className='deadline'><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_0_124)"><path d="M7.90497 10.8975L6.30747 9.29998L5.51247 10.095L7.89747 12.48L12.3975 7.97998L11.6025 7.18498L7.90497 10.8975ZM13.0027 1.35748L16.458 4.24123L15.498 5.39248L12.0405 2.51023L13.0027 1.35748ZM4.99722 1.35748L5.95872 2.50948L2.50272 5.39248L1.54272 4.24048L4.99722 1.35748ZM8.99997 2.99998C5.27247 2.99998 2.24997 6.02248 2.24997 9.74998C2.24997 13.4775 5.27247 16.5 8.99997 16.5C12.7275 16.5 15.75 13.4775 15.75 9.74998C15.75 6.02248 12.7275 2.99998 8.99997 2.99998ZM8.99997 15C6.10497 15 3.74997 12.645 3.74997 9.74998C3.74997 6.85498 6.10497 4.49998 8.99997 4.49998C11.895 4.49998 14.25 6.85498 14.25 9.74998C14.25 12.645 11.895 15 8.99997 15Z" fill="#EEA21B"/></g><defs><clipPath id="clip0_0_124"><rect width="18" height="18" fill="white"/></clipPath></defs></svg>До дедлайна: {timeLeft}</div>
                <div className='description'>Описание: <div className='descText'>{Deadline.description}</div> </div>
                <div className="btnCloseModal"onClick={onClose}><div className='icon'><div className='cross'></div></div></div>
                <div className="deleteButton" onClick={openCloseModal}>
                {creatorId === userId && (
                <button>
                    Удалить Дедлайн
                    <DeleteDeadline
                        onClose={closeCloseModal}
                        isOpen={isModalCloseOpen}
                        group={group}
                        id={id}
                    />
                </button>
          )}
        </div>
            </div>
        </div>
    );
}

export default OrderModal;
