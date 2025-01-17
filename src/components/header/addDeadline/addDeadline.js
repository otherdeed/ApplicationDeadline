import './addDeadline.css'
import React,{useState} from 'react';
import AddDeadlineModal from './addDeadlineModal/addDeadlineModal';
function AddDeadline({folder}){ 
    const [isModalOpen, setModalOpen] = useState(false);
    function openDeadline() {
        setModalOpen(true);
    }

    function closeDeadline() {
        setModalOpen(false);
    }
    return(
        <div onClick={openDeadline}>
            Создать Дедлайн 
            <AddDeadlineModal folder={folder} isOpen={isModalOpen} onClose={closeDeadline}/>
        </div>
    )
}

export default AddDeadline;