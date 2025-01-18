import axios from "axios";
import "./addDeadlineModal.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

function AddDeadlineModal({ isOpen, onClose, folder }) {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const members = useSelector((state) => state.myGroup.members);
  const nameGroup = useSelector(state => state.myGroup.name)
  // Сброс состояния формы при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      setSubject("");
      setDescription("");
      setDeadline("");
      setPriority("");
      setError("");
      setIsExiting(false); // Сброс состояния выхода
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("no-scroll"); // Добавляем класс для отключения прокрутки
    } else {
      document.body.classList.remove("no-scroll"); // Удаляем класс при закрытии
    }

    return () => {
      document.body.classList.remove("no-scroll"); // Убедимся, что класс удаляется при размонтировании
    };
  }, [isOpen]);
  // Функция для добавления дедлайна
  async function addDeadline() {
    if (!subject || !description || !deadline || !priority) {
      setError("Пожалуйста, заполните все поля.");
      return;
    }

    try {
      const newDeadline = await axios.post(
        "http://localhost:3001/newDeadline",
        {
          subject,
          description,
          deadline,
          priority,
          folderId: folder,
          members: members,
          nameGroup: nameGroup
        }
      );
      if (newDeadline.status === 200) {
        onClose(); // Закрываем модальное окно после успешного добавления
      }
    } catch (error) {
      setError("Ошибка при добавлении дедлайна. Попробуйте еще раз.");
      console.error(error);
    }
  }

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Время анимации должно совпадать с длительностью fadeOut
  };

  if (!isOpen && !isExiting) return null; // Не отображаем модальное окно, если оно закрыто

  return (
    <div className={`modal-overlayDealine ${isExiting ? 'fade-out' : ''}`} onClick={handleClose}>
      <div
        className={`modal-contentDealine ${isExiting ? 'fade-out' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <form className="addDeadline" onSubmit={(e) => e.preventDefault()}>
          <div className="inputBlock">
            <input
              id="subject"
              placeholder="Предмет"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="inputBlock">
            <input
              id="description"
              placeholder="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="inputBlock dateInput">
            <input
              type="date"
              id="deadline"
              placeholder="Дата"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <div className="DateText">укажите Дату</div>
          </div>
          <div className="importance-container">
            <label className="color-square" style={{ backgroundColor: "#00A838" }}>
              <input
                type="radio"
                name="priority"
                value="1"
                checked={priority === "1"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <span className="square-text"></span>
            </label>
            <label className="color-square" style={{ backgroundColor: "#EFA31A" }}>
              <input
                type="radio"
                name="priority"
                value="2"
                checked={priority === "2"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <span className="square-text"></span>
            </label>
            <label className="color-square" style={{ backgroundColor: "#B50507" }}>
              <input
                type="radio"
                name="priority"
                value="3"
                checked={priority === "3"}
                onChange={(e) => setPriority(e.target.value)}
              />
              <span className="square-text"></span>
            </label>
          </div>
          <div className="PriorityText">укажите Приоритет</div>
          {error && <div className="error">{error}</div>}
          <button type="button" onClick={addDeadline}>
            Добавить дедлайн
          </button>
        </form>
        <div className="closeBtn" onClick={handleClose}>
          <div className="icon">
            <div className="cross"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddDeadlineModal;
