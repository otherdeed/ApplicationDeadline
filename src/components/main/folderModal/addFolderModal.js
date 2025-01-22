import axios from 'axios';
import './addFolderModal.css';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

function AddFolderModal({ onClose, isOpen }) {
    const [folderName, setFolderName] = useState('');
    const [isExiting, setIsExiting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const myGroup = useSelector(state => state.myGroup);
    const members = useSelector(state => state.myGroup.members);
    const addFolder = async () => {
        if (!folderName.trim()) {
            alert('Имя папки не может быть пустым.');
            return;
        }
        if(folderName.length > 10){
            alert('Имя папки не может быть длиннее 10 символов.');
            return;
        }

        setIsLoading(true);
        try {
            await axios.post('https://deadlineminder.store/createNewFolder', {
                id: myGroup.id_group,
                folderName: folderName,
                members
            });
            setFolderName('');
            onClose();
        } catch (err) {
            console.error('ErrorAddFolder:', err);
            alert('Ошибка добавления папки');
        } finally {
            setIsLoading(false);
        }
    };

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
            <div
                className={`modal-content ${isExiting ? 'fade-out' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <form className='addDeadline' onSubmit={e => e.preventDefault()}>
                    <input
                        id='folder'
                        placeholder='Имя папки'
                        value={folderName}
                        onChange={e => setFolderName(e.target.value)}
                    />
                    <button type="button" onClick={addFolder} disabled={isLoading}>
                        {isLoading ? 'Добавление...' : 'Добавить'}
                    </button>
                </form>
                <div className="CloseBtn" onClick={handleClose}>
                    <div className='Icon'>
                        <div className='cross'></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddFolderModal;
