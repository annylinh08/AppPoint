-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2020 at 02:41 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.4.11


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doctorcare`
--
CREATE DATABASE IF NOT EXISTS `appointment` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `appointment`;

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorId` int(11) DEFAULT NULL,
  `timeBooking` varchar(255) DEFAULT NULL,
  `dateBooking` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `doctorId`, `timeBooking`, `dateBooking`, `name`, `phone`, `content`, `status`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(2, 12, '08:00 - 09:00', '15/11/2020', 'Alex', '0321456789', 'very good!', 1, '2020-11-15 08:25:42', '2020-11-15 08:25:56', NULL),
(3, 12, '10:00 - 11:00', '15/11/2020', 'Kane', '0321848484', 'excellent service. I love it', 1, '2020-11-15 08:28:51', '2020-11-15 08:28:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_users`
--

DROP TABLE IF EXISTS `doctor_users`;
CREATE TABLE IF NOT EXISTS `doctor_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorId` int(11) NOT NULL,
  `specializationId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `doctor_users`
--

INSERT INTO `doctor_users` (`id`, `doctorId`, `specializationId`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 2, 1, '2020-11-13 19:46:18', '2020-11-13 19:46:18', NULL),
(2, 3, 2, '2020-11-13 20:19:56', '2020-11-13 20:19:56', NULL),
(3, 4, 3, '2020-11-13 20:20:15', '2020-11-13 20:20:15', NULL),
(4, 5, 5, '2020-11-13 20:20:26', '2020-11-13 20:20:26', NULL),
(5, 6, 6, '2020-11-13 20:20:38', '2020-11-14 19:49:26', NULL),
(6, 7, 2, '2020-11-13 20:20:53', '2020-11-14 19:49:12', NULL),
(7, 12, 1, '2021-03-21 11:11:50', '2021-03-21 11:11:50', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `extrainfos`
--

DROP TABLE IF EXISTS `extrainfos`;
CREATE TABLE IF NOT EXISTS `extrainfos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientId` int(11) DEFAULT NULL,
  `historyBreath` text DEFAULT NULL,
  `placeId` int(11) DEFAULT NULL,
  `oldForms` text DEFAULT NULL,
  `sendForms` text DEFAULT NULL,
  `moreInfo` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorId` int(11) NOT NULL,
  `statusId` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `dateBooking` varchar(255) DEFAULT NULL,
  `timeBooking` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `doctorId`, `statusId`, `name`, `phone`, `dateBooking`, `timeBooking`, `email`, `address`, `description`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 12, 1, 'Alex', '0321456789', '15/11/2020', '08:00 - 09:00', 'alex@gmail.com', 'usa', 'aaaaaaaaaaaaaaaaaa', '2020-11-14 20:20:18', '2020-11-14 20:22:14', NULL),
(5, 12, 1, 'Kane', '0321848484', '15/11/2020', '10:00 - 11:00', 'kane@gmail.com', 'usa', '', '2020-11-15 08:27:25', '2020-11-15 08:27:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `places`
--

DROP TABLE IF EXISTS `places`;
CREATE TABLE IF NOT EXISTS `places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `places`
--

INSERT INTO `places` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Toronto', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(2, 'Aurora', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(3, 'Barrie', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(4, 'New Market', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(5, 'Texas', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `contentMarkdown` text DEFAULT NULL,
  `contentHTML` text DEFAULT NULL,
  `forDoctorId` int(11) DEFAULT NULL,
  `forSpecializationId` int(11) DEFAULT NULL,
  `writerId` int(11) NOT NULL,
  `confirmByDoctor` tinyint(1) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;


-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ADMIN', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(2, 'MERCHANT', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(3, 'SUPPORTER', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
CREATE TABLE IF NOT EXISTS `schedules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `doctorId` int(11) NOT NULL,
  `date` varchar(255) DEFAULT NULL,
  `time` varchar(255) DEFAULT NULL,
  `maxBooking` varchar(255) DEFAULT NULL,
  `sumBooking` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE IF NOT EXISTS `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20200311024259-users.js'),
('20200311025445-create-role.js'),
('20200311025538-create-post.js'),
('20200311025604-create-specialization.js'),
('20200311025619-create-schedule.js'),
('20200311025632-create-status.js'),
('20200311025648-create-patient.js'),
('migration-create-comment.js'),
('migration-create-doctor-user.js'),
('migration-create-extraInfo.js'),
('migration-create-place.js'),
('migration-create-supporterLog.js');

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
CREATE TABLE IF NOT EXISTS `session` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `specializations`
--

DROP TABLE IF EXISTS `specializations`;
CREATE TABLE IF NOT EXISTS `specializations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `specializations`
--


INSERT INTO `specializations` (`id`, `name`, `description`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Nails', NULL, 'nail.jpg', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(2, 'Hair', NULL, 'hair.jpg', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(3, 'Massage', NULL, 'massage.jpg', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(5, 'Eyelash', NULL, 'eyelash.jpg', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(6, 'Dental', NULL, 'dental.jpg', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL);


-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

DROP TABLE IF EXISTS `statuses`;
CREATE TABLE IF NOT EXISTS `statuses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'SUCCESS', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(2, 'FAILED', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(3, 'PENDING', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(4, 'NEW', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(5, 'DONE', '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supporterlogs`
--

DROP TABLE IF EXISTS `supporterlogs`;
CREATE TABLE IF NOT EXISTS `supporterlogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `patientId` int(11) DEFAULT NULL,
  `supporterId` int(11) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supporterlogs`
--

INSERT INTO `supporterlogs` (`id`, `patientId`, `supporterId`, `content`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(7, 4, NULL, 'The customer made an appointment from the system ', '2020-11-14 20:20:18', '2020-11-14 20:20:18', NULL),
(8, 4, 8, 'New appointments have been received', '2020-11-14 20:20:41', '2020-11-14 20:20:41', NULL),
(9, 4, 8, 'Cancel with reason - The customer canceled the schedule', '2020-11-14 20:20:47', '2020-11-14 20:20:47', NULL),
(10, 5, NULL, 'The customer made an appointment from the system ', '2020-11-15 08:27:25', '2020-11-15 08:27:25', NULL),
(11, 5, 8, 'New appointments have been received', '2020-11-15 08:27:36', '2020-11-15 08:27:36', NULL),
(12, 5, 8, 'The appointment has been successfully booked', '2020-11-15 08:27:40', '2020-11-15 08:27:40', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `roleId` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `deletedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--
INSERT INTO `users` (`id`, `name`, `email`, `password`, `address`, `phone`, `avatar`, `description`, `roleId`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'admin - App-point', 'admin@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', 'Toronto', '088456732', 'admin.png', NULL, 1, 1, '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(2, 'Hardrock Nails', 'johny@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '790 Broadview Ave, Toronto, ON M4K 2P7', '088456735', 'johny.jpg', '   ', 2, 1, '2020-11-13 19:44:36', '2020-11-13 19:46:18', NULL),
(3, 'Beauty Divine', 'kelly@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '2391 Bloor St W, Toronto, ON M6S 1P6', '088456735', 'kelly.jpg', '   ', 2, 1, '2020-11-13 19:44:36', '2020-11-13 20:19:55', NULL),
(4, 'Hand & Stone', 'jasmin@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '130 Live Eight Way, Barrie, ON L4N 6P1', '088456735', 'jasmin.jpg', '   ', 2, 1, '2020-11-13 19:44:36', '2020-11-13 20:20:15', NULL),
(5, 'Eye Love Lashes', 'jenn@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '151 Essa Rd, Barrie, ON L4N 3L2', '088456735', 'jenn.jpg', '   ', 2, 1, '2020-11-13 19:44:36', '2020-11-13 20:20:26', NULL),
(6, 'New Market Dental', 'sam@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '17906 Yonge St #2, Newmarket, ON L3Y 8S1', '088456735', 'doctor4.jpg','      ', 2, 1, '2020-11-13 19:44:36', '2020-11-14 19:49:26', NULL),
(7, 'Envy Hair Salon', 'ben@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', '241 Essa Rd #2, Barrie, ON L4N 6B7', '088456735', 'doctor1.jpg','      ', 2, 1, '2020-11-13 19:44:36', '2020-11-14 19:49:12', NULL),
(8, 'Supporter - Eric Pham', 'supporter@gmail.com', '$2a$07$Bq0hCq3kVrvKUHfMT0NJROmQkx09aEQkGlwBGEdw799YJvWqH1kuy', 'Toronto', '088456736', 'supporter.png', NULL, 3, 1, '2020-11-13 19:44:36', '2020-11-13 19:44:36', NULL),
(12, 'Park Place Nails', 'info@parkplacenailsbarrie.ca', '$2a$07$9BufuZLkxEgNpDmpoKwkH.IbG.2fdvFKPahJQOIPwKoHiuFWvnG6W', '1b-24 North Village Way, Barrie, On, L4N6P3', '7055946520', 'business.jpg', 'This is a nail salon in Barrie', 2, 1, '2021-03-21 11:11:50', '2021-03-21 11:11:50', NULL);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
