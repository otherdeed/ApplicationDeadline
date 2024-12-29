import './deleteDeadline.css'
import axios from 'axios';
function DeleteDeadline({onClose, isOpen, id, group}){
        async function deleteDeadline() {
            try {
                const response = await axios.delete('/server/routes/deleteDeadline.php', {
                    data: {
                        groupId: group.creator.group_id,
                        deadlineId: id
                    }
                });
                console.log('Delete Deadline:', response.data); 
                window.location.reload(); // Раскомментируйте, если хотите перезагрузить страницу
            } catch (error) {
                console.error('Ошибка при удалении дедлайна:', error);
            }
        }
    if (!isOpen) return null; 
    return (
        <div className="modal-overlayClose" onClick={onClose}>
            <div className="modal-contentClose" onClick={(e) => e.stopPropagation()}>
            <div className='modal-overlayCloseText'>
                    Точно удалить?
                </div>
                <div className='btnContainer'>
                    <button className="deleteDeadline" onClick={deleteDeadline}>ДА</button>
                    <button className="btnCloseModal"onClick={onClose}>НЕТ</button>
                </div>
            </div>
        </div>
    );
}

export default DeleteDeadline;