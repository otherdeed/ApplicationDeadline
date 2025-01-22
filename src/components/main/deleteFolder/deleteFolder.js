import './deleteFolder.css'
import axios from 'axios';
import { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setDeadlines } from '../../../store/client/myDeadlineSlice';
function DeleteFolder({onClose, isOpen, folderId}){
    const [isExiting, setIsExiting] = useState(false);
    const myGroupMembers = useSelector(state => state.myGroup.members);
    const myGroup = useSelector(state => state.myGroup);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    function deleteFolder(){
        try {
            axios.post('https://deadlineminder.store/deleteFolder',{
                id_folder: folderId,
                members: myGroupMembers
            })
            dispatch(setDeadlines([]));
            handleClose();
        } catch (error) {
            console.error('deleteFolder Error:', error);
        }
    }
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
    if(myGroup?.admin === user?.id){
        return (
            <div className={`modal-overlayDealine ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
            <div
              className={`modal-contentDealine ${isExiting ? 'fade-out' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
            <div className='modal-text'>
                Удалить папку?
            </div>
                <button className="close-button-folder" onClick={deleteFolder}>Да</button>
                <button className="close-button-folder" onClick={handleClose}>Нет</button>
                </div>
            </div>
        )
    } else{
        return (
            <div className={`modal-overlayDealine ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
            <div
              className={`modal-contentDealine ${isExiting ? 'fade-out' : ''}`}
              onClick={(e) => e.stopPropagation()}
            >
            <div className='modal-text'>
                Вы не можете удалить папку
            </div>
                <button className="close-button-folder" onClick={handleClose}>Скрыть</button>
                </div>
            </div>
        )
    }
 
}

export default DeleteFolder;