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
                    <div class="burger" id="burger">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
                <div className='groupName'>
                    <div>{group.name}</div>
                </div>
            </div>
        );
    } else if (group.creator?.id !== user.id && group.creator?.id !== undefined) {
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup myGroups={myGroups} group={group} isOpen={isModalOpen} onClose={closeModalGroup}/>
                    <div class="burger" id="burger">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
                <div className='groupName'>
                    <div>{group.name}</div>
                </div>
            </div>
        );
    } else {
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup myGroups={myGroups} group={group} isOpen={isModalOpen} onClose={closeModalGroup}/>
                    <div class="burger" id="burger">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
                <div className='groupName'>
                    <div>У вас нет групп</div>
                </div>
            </div>
        );
    }
}

export default Header;
