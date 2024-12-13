import './changeGroup.css'
import { useDispatch } from 'react-redux';
import { setMyGroup } from '../../../store/client/myGroupSlice';
function ChangeGroup({isOpen, onClose, myGroups}){
        const dispatch = useDispatch();
    
        const changeGroup = (name) => {
            const selectedGroup = Object.values(myGroups).find(group => group.name === name);
            if (selectedGroup) {
                dispatch(setMyGroup(selectedGroup)); // Сохраняем выбранную группу в Redux
            }
        };
    if (!isOpen) return null; 
    return (
        <div className="modal-overlayGroup" onClick={onClose}>
            <div className="modal-contentGroup" onClick={(e) => e.stopPropagation()}>
                  {Object.values(myGroups).map(group => (
                       <div className='groupBlock'>
                            <button key={group.name} onClick={() => changeGroup(group.name)}>
                                {group.name}
                            </button>
                       </div>
                    ))}
                <button className='btnClose' onClick={onClose}>Закрыть</button>
            </div>
        </div>
    );
}

export default ChangeGroup;