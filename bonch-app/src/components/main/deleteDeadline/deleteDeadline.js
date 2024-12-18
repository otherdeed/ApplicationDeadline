import './deleteDeadline.css'
import axios from 'axios';
function DeleteDeadline({onClose, isOpen, id, group}){
        async function deleteDeadline() {
            console.log('дедлайн:', id);
            console.log('группа:', group.creator.group_id);
            try {
                const response = await axios.delete('https://deadlineminder.ru/server/routes/deleteDeadline.php', {
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
            <div className='modal-overlayCloseText'>
                Вы действительно хотите удалить этот дедлайн?
            </div>
            <div className="modal-contentClose" onClick={(e) => e.stopPropagation()}>
                <button onClick={deleteDeadline}>Удалить</button>
                <button className="btnCloseModal"onClick={onClose}>Не удалять</button>
            </div>
        </div>
    );
}

export default DeleteDeadline;