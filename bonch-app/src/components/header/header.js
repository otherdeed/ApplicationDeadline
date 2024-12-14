import './header.css';
import React, {useState} from 'react';
import ChangeGroup from './changeGroup/changeGroup';
function Header({ group, user, myGroups, changeGroup }) {
    const [isModalOpen, setModalOpen] = useState(false);
    function openModalGroup() {
        setModalOpen(true);
    }

    // Функция для закрытия модального окна
    function closeModalGroup() {
        setModalOpen(false);
    }

    if (group.creator?.id === user.id) {
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup  myGroups={myGroups} group={group} isOpen={isModalOpen} onClose={closeModalGroup} changeGroup={changeGroup}/>
                    |||
                </div>
                <div className='groupName'>
                    <div>ГРУППА: {group.name}</div>
                </div>
            </div>
        );
    } else if (group.creator?.id !== user.id && group.creator.id !== undefined) {
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup myGroups={myGroups} group={group} isOpen={isModalOpen} onClose={closeModalGroup}/>

                    |||
                </div>
                <div className='groupName'>
                    <div>ГРУППА: {group.name}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup myGroups={myGroups} group={group} isOpen={isModalOpen} onClose={closeModalGroup}/>

                    |||
                </div>
                <div className='groupName'>
                    <div>У вас нет групп</div>
                </div>
            </div>
        );
    }
}

export default Header;
