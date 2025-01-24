-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:3306
-- Время создания: Янв 17 2025 г., 20:41
-- Версия сервера: 5.7.24
-- Версия PHP: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `deadline_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `deadlines`
--

CREATE TABLE `deadlines` (
  `id_deadline` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `due_date` datetime NOT NULL,
  `description` text NOT NULL,
  `priority` int(11) NOT NULL,
  `id_folder` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `deadlines`
--

INSERT INTO `deadlines` (`id_deadline`, `name`, `due_date`, `description`, `priority`, `id_folder`) VALUES
('99lvd', 'Инженерная графика', '2025-01-01 00:00:00', 'сделать дз', 3, 'qvo6y'),
('g57k4', 'Тествоая 3', '2025-01-22 00:00:00', 'сделать дз', 1, 'qvo6y'),
('h5ru1', 'Тестовая ', '2025-01-19 00:00:00', 'тест1', 3, 'qvo6y'),
('nxu8s', 'Инженерная графика', '2025-01-09 00:00:00', 'сделать дз', 2, 'qvo6y'),
('t6tmf', 'Тествоая 2', '2025-02-06 00:00:00', 'контрольная', 2, 'qvo6y');

-- --------------------------------------------------------

--
-- Структура таблицы `folders`
--
CREATE TABLE `folders` (
  `id_folder` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `id_group` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 

-- Дамп данных таблицы `folders`
--

INSERT INTO `folders` (`id_folder`, `name`, `id_group`) VALUES
('qvo6y', 'new Folder', 'tl3mx');

-- --------------------------------------------------------

--
-- Структура таблицы `groups`
--

CREATE TABLE `groups` (
  `id_group` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('public','private') NOT NULL,
  `admin` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `groups`
--

INSERT INTO `groups` (`id_group`, `name`, `type`, `admin`) VALUES
('dse3r', 'den', 'private', 390301352),
('tl3mx', 'Тестовая', 'private', 1875576355);

-- --------------------------------------------------------

--
-- Структура таблицы `group_members`
--

CREATE TABLE `group_members` (
  `id_group` varchar(20) NOT NULL,
  `member` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `group_members`
--

INSERT INTO `group_members` (`id_group`, `member`) VALUES
('tl3mx', 1875576355);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `tg_id` bigint(20) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`tg_id`, `username`, `first_name`) VALUES
(390301352, 'Lamaq0', 'Lamaq'),
(854552457, 'vovaqo', 'Вова'),
(1285315404, 'R0manKir', 'Роман'),
(1875576355, 'ttimmur', 'Тимур');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `deadlines`
--
ALTER TABLE `deadlines`
  ADD PRIMARY KEY (`id_deadline`),
  ADD KEY `id_folder` (`id_folder`);

--
-- Индексы таблицы `folders`
--
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id_folder`),
  ADD KEY `id_group` (`id_group`);

--
-- Индексы таблицы `groups`
--
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id_group`),
  ADD KEY `admin` (`admin`);

--
-- Индексы таблицы `group_members`
--
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id_group`,`member`),
  ADD KEY `member` (`member`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`tg_id`),
  ADD UNIQUE KEY `tg_id` (`tg_id`);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `deadlines`
--
ALTER TABLE `deadlines`
  ADD CONSTRAINT `deadlines_ibfk_1` FOREIGN KEY (`id_folder`) REFERENCES `folders` (`id_folder`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `folders`
--
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`id_group`) REFERENCES `groups` (`id_group`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `groups`
--
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `users` (`tg_id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `group_members`
--
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`id_group`) REFERENCES `groups` (`id_group`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`tg_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
