import './addDeadline.css'
import React,{useState} from 'react';
import AddDeadlineModal from './addDeadlineModal/addDeadlineModal';
function AddDeadline({group}){
    const [isModalOpen, setModalOpen] = useState(false);
    function openDeadline() {
        setModalOpen(true);
    }

    function closeDeadline() {
        setModalOpen(false);
    }
    return(
        <div  onClick={openDeadline}>
            Добавить дедлайн 
            <AddDeadlineModal isOpen={isModalOpen} onClose={closeDeadline} group={group}/>
        </div>
    )
}

export default AddDeadline;