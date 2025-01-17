import './header.css';
import React, {useState} from 'react';
import ChangeGroup from './changeGroup/changeGroup';
import { useSelector } from 'react-redux';
import AboutGroup from './aboutGroup/aboutGroup';
function Header() {
    const [isModalOpen, setModalOpen] = useState(false);
    const myGroupName = useSelector(state => state.myGroup.name)
    function openModalGroup() {
        setModalOpen(true);
    }

    // Функция для закрытия модального окна
    function closeModalGroup() {
        setModalOpen(false);
    }
        return (
            <div className="header-container">
                <div className='changeGroup' onClick={openModalGroup}>
                    <ChangeGroup isOpen={isModalOpen} onClose={closeModalGroup}/>
                    <div class="burger" id="burger">
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                        <div class="line"></div>
                    </div>
                </div>
                <div className='groupName'>
                    <div>{myGroupName}</div>
                </div>
                <div className='aboutBtn'>
                    <AboutGroup/>
                </div>
            </div>
        );
}

export default Header;
