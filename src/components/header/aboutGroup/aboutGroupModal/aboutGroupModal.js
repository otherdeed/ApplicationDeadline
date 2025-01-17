import './aboutGroupModal.css'
import { useState } from 'react';
import { useSelector } from 'react-redux';
function AboutGroupModal({ onClose, isOpen }) {
    const myGroup = useSelector(state => state.myGroup);

    const [isExiting, setIsExiting] = useState(false);
    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
            setIsExiting(false);
        }, 300); // Должно совпадать с продолжительностью анимации
    };
    function renderTypeGroup() {
        if (myGroup.type === 'public') {
            return 'Открытая';
        } else if (myGroup.type === 'private') {
            return 'Закрытая';
        }
    }
    if (!isOpen && !isExiting) return null;
    return (
        <div className="modal-overlaAbout" onClick={handleClose}>
            <div
                className={`modal-contentAbout ${isOpen ? 'slide-in' : ''} ${isExiting ? 'slide-out' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className='modal-text'>
                    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleClose}>
                        <g clip-path="url(#clip0_0_66)">
                            <path d="M11.4583 7.29165H13.5416V9.37498H11.4583V7.29165ZM11.4583 11.4583H13.5416V17.7083H11.4583V11.4583ZM12.5 2.08331C6.74998 2.08331 2.08331 6.74998 2.08331 12.5C2.08331 18.25 6.74998 22.9166 12.5 22.9166C18.25 22.9166 22.9166 18.25 22.9166 12.5C22.9166 6.74998 18.25 2.08331 12.5 2.08331ZM12.5 20.8333C7.90623 20.8333 4.16665 17.0937 4.16665 12.5C4.16665 7.90623 7.90623 4.16665 12.5 4.16665C17.0937 4.16665 20.8333 7.90623 20.8333 12.5C20.8333 17.0937 17.0937 20.8333 12.5 20.8333Z" fill="#EFA31A" />
                        </g>
                        <defs>
                            <clipPath id="clip0_0_66">
                                <rect width="25" height="25" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    Основная информация
                </div>
                <div className='contentAbout'>
                    <div className="about-info">
                        <div>Название группы:</div>
                        <div>{myGroup.name}</div>
                    </div>
                    <div className="about-info">
                        <div>ID группы:</div>
                        <div>{myGroup.id_group}</div>
                    </div>
                    <div className="about-info">
                        <div>Кол-во учатников:</div>
                        <div>{myGroup.members.length}</div>
                    </div>
                    <div className="about-info">
                        <div>Тип группы:</div>
                        <div>{renderTypeGroup()}</div>
                    </div>
                </div>
                <button className="close-button" onClick={handleClose}>Скрыть</button>
            </div>
        </div>
    )
}

export default AboutGroupModal