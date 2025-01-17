import './changeGroup.css';
import { useDispatch, useSelector } from 'react-redux';
import { setMyGroup } from '../../../store/client/myGroupSlice';
import { useEffect, useState } from 'react';
import { setFolderID } from '../../../store/client/groupSlice';
function ChangeGroup({ isOpen, onClose }) {
    const groups = useSelector(state => state.groups.groups);
    const dispatch = useDispatch();
    const [isExiting, setIsExiting] = useState(false);
    const changeGroup = (name) => {
        const selectedGroup = Object.values(groups).find(group => group.name === name);
        if (selectedGroup) {
            const index = Object.values(groups).findIndex(group => group.name === name);
            localStorage.setItem('group', index);
            dispatch(setMyGroup(selectedGroup));
            handleClose();
            dispatch(setFolderID(null));
        }
    };

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300); // Должно совпадать с продолжительностью анимации
    };

    if (!isOpen && !isExiting) return null;

    return (
        <div className="modal-overlayGroup" onClick={handleClose}>
            <div 
                className={`modal-contentGroup ${isOpen ? 'slide-in' : ''} ${isExiting ? 'slide-out' : ''}`} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className='modalName'>
                    <div className='group'>Группы</div>
                    <div className='burgerChangeGroup'>
                        <div onClick={handleClose} className="burger" id="burger">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                    </div>
                </div>
                {groups.map(group => (
                    <div className='groupBlock' key={group.id}>
                        <button onClick={() => changeGroup(group.name)}>{group.name}</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChangeGroup;
