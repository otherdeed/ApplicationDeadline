SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
CREATE TABLE `deadlines` (
  `id_deadline` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `due_date` datetime NOT NULL,
  `description` text NOT NULL,
  `priority` int(11) NOT NULL,
  `id_folder` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `folders` (
  `id_folder` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `id_group` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `groups` (
  `id_group` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('public','private') NOT NULL,
  `admin` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `group_members` (
  `id_group` varchar(20) NOT NULL,
  `member` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE `users` (
  `tg_id` bigint(20) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
ALTER TABLE `deadlines`
  ADD PRIMARY KEY (`id_deadline`),
  ADD KEY `id_folder` (`id_folder`);
ALTER TABLE `folders`
  ADD PRIMARY KEY (`id_folder`),
  ADD KEY `id_group` (`id_group`);
ALTER TABLE `groups`
  ADD PRIMARY KEY (`id_group`),
  ADD KEY `admin` (`admin`);
ALTER TABLE `group_members`
  ADD PRIMARY KEY (`id_group`,`member`),
  ADD KEY `member` (`member`);
ALTER TABLE `users`
  ADD PRIMARY KEY (`tg_id`),
  ADD UNIQUE KEY `tg_id` (`tg_id`);
ALTER TABLE `deadlines`
  ADD CONSTRAINT `deadlines_ibfk_1` FOREIGN KEY (`id_folder`) REFERENCES `folders` (`id_folder`) ON DELETE CASCADE;
ALTER TABLE `folders`
  ADD CONSTRAINT `folders_ibfk_1` FOREIGN KEY (`id_group`) REFERENCES `groups` (`id_group`) ON DELETE CASCADE;
ALTER TABLE `groups`
  ADD CONSTRAINT `groups_ibfk_1` FOREIGN KEY (`admin`) REFERENCES `users` (`tg_id`) ON DELETE CASCADE;
ALTER TABLE `group_members`
  ADD CONSTRAINT `group_members_ibfk_1` FOREIGN KEY (`id_group`) REFERENCES `groups` (`id_group`) ON DELETE CASCADE,
  ADD CONSTRAINT `group_members_ibfk_2` FOREIGN KEY (`member`) REFERENCES `users` (`tg_id`) ON DELETE CASCADE;
COMMIT;