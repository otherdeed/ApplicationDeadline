import './changeGroup.css'
import { useDispatch } from 'react-redux';
import { setMyGroup } from '../../../store/client/myGroupSlice';
function ChangeGroup({isOpen, onClose, myGroups}){
        const dispatch = useDispatch();
        const changeGroup = (name) => {
            const selectedGroup = Object.values(myGroups).find(group => group.name === name);
            if (selectedGroup) {
                // Получаем индекс выбранной группы
                const index = Object.values(myGroups).findIndex(group => group.name === name);
                localStorage.setItem('group',index)
                dispatch(setMyGroup(selectedGroup)); // Сохраняем выбранную группу в Redux
                onClose()
            }     
        };        
    if (!isOpen) return null; 
    return (
        <div className="modal-overlayGroup" onClick={onClose}>
            <div className="modal-contentGroup" onClick={(e) => e.stopPropagation()}>
                <div className='modalName'>   
                    Группы
                    <div onClick={onClose} class="vertical-burger" id="burgerMenu">
                        <div class="burger-strip"></div>
                        <div class="burger-strip"></div>
                        <div class="burger-strip"></div>
                        <div class="burger-strip"></div>
                    </div>
                </div>
                  {Object.values(myGroups).map(group => (
                       <div className='groupBlock'>
                            <button key={group.name} onClick={() => changeGroup(group.name)}>
                                {group.name}
                            </button>
                       </div>
                    ))}
            </div>
        </div>
    );
}

export default ChangeGroup;