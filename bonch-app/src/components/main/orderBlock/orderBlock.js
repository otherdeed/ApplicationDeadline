import React, { useState} from 'react';
import './orderBlock.css';
import OrderModal from '../orderModal/orderModal';
import axios from 'axios';
function OrderBlock({group,id,subject,deadline, description,isCompleted, creatorId, userId}) {
    const [isModalOpen, setModalOpen] = useState(false);
    // Функция для открытия модального окна и увеличения просмотров
    function openOrderDesc() {
        setModalOpen(true);
    }

    function closeOrderDesc() {
        setModalOpen(false);
    }
    async function deleteDeadline(){
        await axios.post('http://localhost:3001/deleteDeadline',{
            groupName:group.name, 
            deadlineId:id
        })
    }
    const Deadline = { id,subject,deadline, description,isCompleted};
    if(creatorId === userId){
        return (
            <>
                <div className="order-block" onClick={openOrderDesc}>
                    <button onClick={deleteDeadline}>x</button>
                    <div className="order-preview">{subject}</div>
                    <div className="order-price">{deadline}</div>
                </div>
                <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} />
            </>
        );
    }else{
        return (
            <>
                <div className="order-block" onClick={openOrderDesc}>
                    <div className="order-preview">{subject}</div>
                    <div className="order-price">{deadline}</div>
                </div>
                <OrderModal isOpen={isModalOpen} onClose={closeOrderDesc} Deadline={Deadline} />
            </>
        );
    }
            
}

export default OrderBlock;
