import React, { useState, useEffect } from "react";
import "./orderBlock.css";
import OrderModal from "../orderModal/orderModal";
import DeleteDeadline from "../deleteDeadline/deleteDeadline";
import axios from "axios";

function OrderBlock({
  group,
  id,
  subject,
  deadline,
  description,
  isCompleted,
  creatorId,
  userId,
}) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(""); // Состояние для оставшегося времени
  const [blockColor, setBlockColor] = useState(""); // Состояние для цвета блока

  // Функция для открытия модального окна
  function openOrderDesc() {
    setModalOpen(true);
  }

  // Функция для закрытия модального окна
  function closeOrderDesc() {
    setModalOpen(false);
  }
  // Функция для удаления дедлайна
  const Deadline = { id, subject, deadline, description, isCompleted };

  // Функция для вычисления оставшегося времени
  const calculateTimeLeft = () => {
    const deadlineDate = new Date(deadline); // Преобразуем строку в объект Date
    const now = new Date();
    const difference = deadlineDate - now; // Разница в миллисекундах

    // Если разница меньше 0, значит дедлайн прошел
    if (difference <= 0) {
      setTimeLeft("Время вышло"); // Сообщение, если дедлайн прошел
      setBlockColor("#8C2D2D"); // Цвет для прошедшего дедлайна
    } else {
      const daysLeft = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );

      if (daysLeft > 0) {
        setTimeLeft(`${daysLeft} дн`); // Если осталось больше дня
      } else {
        setTimeLeft(`${hoursLeft} ч`); // Если осталось меньше дня
        // Устанавливаем цвет в зависимости от оставшегося времени
        if (difference < 3600000) {
          setBlockColor("black");
        } else {
          setBlockColor("#21779C"); // Менее 1 дня
        }
      }
    }
  };

  useEffect(() => {
    calculateTimeLeft(); // Вычисляем время при монтировании компонента
    const interval = setInterval(calculateTimeLeft, 3600000); // Обновляем каждую минуту

    return () => clearInterval(interval); // Очистка интервала при размонтировании
  }, [deadline]);

  return (
    <>
      <div className="order-block" style={{ backgroundColor: blockColor }}>
        <div onClick={openOrderDesc}>
          <div className="order-preview">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_0_85)">
                <path
                  d="M2.25 12.9375V15.75H5.0625L13.3575 7.45504L10.545 4.64254L2.25 12.9375ZM15.5325 5.28004C15.825 4.98754 15.825 4.51504 15.5325 4.22254L13.7775 2.46754C13.485 2.17504 13.0125 2.17504 12.72 2.46754L11.3475 3.84004L14.16 6.65254L15.5325 5.28004Z"
                  fill="#EEA21B"
                />
              </g>
              <defs>
                <clipPath id="clip0_0_85">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            {subject}
          </div>
          <div className="order-price">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_0_75)">
                <path
                  d="M15 2.25H14.25V0.75H12.75V2.25H5.25V0.75H3.75V2.25H3C2.175 2.25 1.5 2.925 1.5 3.75V15.75C1.5 16.575 2.175 17.25 3 17.25H15C15.825 17.25 16.5 16.575 16.5 15.75V3.75C16.5 2.925 15.825 2.25 15 2.25ZM15 15.75H3V7.5H15V15.75ZM15 6H3V3.75H15V6Z"
                  fill="#EEA21B"
                />
              </g>
              <defs>
                <clipPath id="clip0_0_75">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>

            {deadline}
          </div>
          <div className="time-left">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_0_80)">
                <path
                  d="M7.90497 10.8975L6.30747 9.30004L5.51247 10.095L7.89747 12.48L12.3975 7.98004L11.6025 7.18504L7.90497 10.8975ZM13.0027 1.35754L16.458 4.24129L15.498 5.39254L12.0405 2.51029L13.0027 1.35754ZM4.99722 1.35754L5.95872 2.50954L2.50272 5.39254L1.54272 4.24054L4.99722 1.35754ZM8.99997 3.00004C5.27247 3.00004 2.24997 6.02254 2.24997 9.75004C2.24997 13.4775 5.27247 16.5 8.99997 16.5C12.7275 16.5 15.75 13.4775 15.75 9.75004C15.75 6.02254 12.7275 3.00004 8.99997 3.00004ZM8.99997 15C6.10497 15 3.74997 12.645 3.74997 9.75004C3.74997 6.85504 6.10497 4.50004 8.99997 4.50004C11.895 4.50004 14.25 6.85504 14.25 9.75004C14.25 12.645 11.895 15 8.99997 15Z"
                  fill="#EEA21B"
                />
              </g>
              <defs>
                <clipPath id="clip0_0_80">
                  <rect width="18" height="18" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Осталось: {timeLeft}
          </div>{" "}
          {/* Отображаем оставшееся время */}
        </div>
      </div>
      <OrderModal
        isOpen={isModalOpen}
        onClose={closeOrderDesc}
        Deadline={Deadline}
        group={group}
        id={id}
        creatorId={creatorId}
        userId={userId}
        timeLeft={timeLeft}
      />
    </>
  );
}

export default OrderBlock;
