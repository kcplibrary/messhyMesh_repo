-- phpMyAdmin SQL Dump
-- version 5.2.2deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 16, 2026 at 01:00 AM
-- Server version: 8.4.10-0ubuntu0.25.10.1
-- PHP Version: 8.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `messymesh_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookmarks`
--

CREATE TABLE `bookmarks` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `file_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `collections`
--

INSERT INTO `collections` (`id`, `name`, `created_at`) VALUES
(3, 'test', '2026-06-18 07:09:48'),
(4, 'test1', '2026-06-18 07:33:56');

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE `communities` (
  `id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`id`, `name`, `description`) VALUES
(6, 'TTED Community', NULL),
(7, 'SHS Community', NULL),
(8, 'CON Community', NULL),
(44, 'CIT Community', NULL),
(45, 'TTED Community', NULL),
(46, 'COT Community', NULL),
(47, 'CCJE Community', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `ebooks`
--

CREATE TABLE `ebooks` (
  `id` int NOT NULL,
  `filename` varchar(255) NOT NULL,
  `collection_id` int DEFAULT NULL,
  `uploaded_by` varchar(255) NOT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `book_title` varchar(255) NOT NULL,
  `book_author` varchar(255) DEFAULT 'Unknown',
  `book_year` int DEFAULT NULL,
  `subject_tags` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int NOT NULL,
  `filename` varchar(255) NOT NULL,
  `community_id` int DEFAULT NULL,
  `uploaded_by` varchar(50) DEFAULT NULL,
  `upload_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `paper_title` varchar(500) DEFAULT NULL,
  `paper_author` varchar(255) DEFAULT NULL,
  `paper_year` int DEFAULT NULL,
  `keywords` text,
  `abstract` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `filename`, `community_id`, `uploaded_by`, `upload_date`, `paper_title`, `paper_author`, `paper_year`, `keywords`, `abstract`) VALUES
(1, '20260617_1781656324_academic-performance-of-bachelor-in-secondary-education-in-college-algebra.pdf', 4, 'amnekku', '2026-06-16 16:32:04', 'Academic performance of bachelor in secondary education in college algebra', 'Fei Y. Baguitan, Jenny P. Kimbes, Claire M. Marcos, Jareth G. Pal-Iwen', 2015, 'Academic, performance, bachelor, secondary, education, college, algebra', 'This is study was conducted primarily to determine the academic performance of Bachelor of Secondary Education students in College Algebra. SY 2015-2016. Specifically, it sought to answer the questions, What is the level of the academic performances of the respondents in College Algebra; What is the level of effect of the factors to the academic performances of the Bachelor of Secondary Education in College Algebra? This study discovered that the academic performance of the Bachelor of Secondary Education is satisfactory with a weighted mean of 80.3. The factors affecting the academic performance of the respondents includes the student factor, teacher factor, and classroom setting environment factor and most of these factors were affecting much the performances of the respondents. The learning performance of the students in College Algebra is affected much by the student factors as it is implicated by its total weighted mean 2.56. Learning style ranks first with an average weighted mean of 2.68 and the least with an average weighted mean of 2.33 stated to be affecting moderately the performance of the respondent.\n\nThe teacher factors gathered a higher result shown by its total weighted mean 2.84 compared to the other factors affecting the learning performances of the students in Mathematics. Moreover, it affects much the Academic performance of the students in college Algebra. The students gave priority to the mastery of subject matter having a weighted mean of 3.22. On the other hand the well-groomed and well poised with an average weighted mean of 2.37 who ranked 6 affects moderately their academic performances. The classroom setting environment is said to be affecting moderately the Academic performance of the BSEd with a total weighted mean of 2.49. Ventilation and classroom capacity both ranked 1.5 with an average weighted mean of 2.73 affects moderately. Seating arrangement ranks last with an average weighted mean of 2.32 is said to be affecting moderately the respondents\' performance.'),
(2, '20260617_1781676048_aggressive-behavior-affecting-the-learning-process-of-the-pupils-at-the-balili-elementary-school.pdf', 4, 'amnekku', '2026-06-16 22:00:48', 'Aggressive Behavior Affecting the Learning Process of the Pupils at the Balili Elementary School', 'Ronalyn A. Baglao, Novy S. Baliba, Arlyn A. Cabanilla, Angela T. Tomey, Ruby S. Umis', 2016, 'Aggressive Behavior, Learning Process, Balili Elementary School, Elementary Education, Classroom Management, Child Psychology, Student Aggression, Academic Performance, Philippine Education', '');

-- --------------------------------------------------------

--
-- Table structure for table `semester_settings`
--

CREATE TABLE `semester_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `semester_settings`
--

INSERT INTO `semester_settings` (`setting_key`, `setting_value`) VALUES
('current_semester_label', '1st Semester, AY 2026-2027'),
('semester_end_date', '2027-05-03'),
('semester_start_date', '2026-08-03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','employee','student') DEFAULT 'student',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `community_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `created_at`, `community_id`) VALUES
(1, 'amnekku', 'amnekku', 'admin', '2026-05-08 02:57:05', NULL),
(2, 'admin', 'admin', 'admin', '2026-05-15 05:26:25', NULL),
(3, 'staff_', 'staff_', 'employee', '2026-06-17 03:51:29', 1),
(4, 'student', 'student', 'student', '2026-06-17 03:56:35', 8);

-- --------------------------------------------------------

--
-- Table structure for table `user_logins`
--

CREATE TABLE `user_logins` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user_logins`
--

INSERT INTO `user_logins` (`id`, `user_id`, `username`, `role`, `login_time`) VALUES
(1, 9, 'Employee', 'employee', '2026-05-20 03:36:37'),
(2, 10, 'Student_1', 'student', '2026-05-20 03:37:08'),
(3, 10, 'Student_1', 'student', '2026-05-20 03:40:37'),
(4, 1, 'amnekku', 'admin', '2026-05-20 03:41:30'),
(5, 10, 'Student_1', 'student', '2026-05-20 03:57:46'),
(6, 1, 'amnekku', 'admin', '2026-05-20 05:30:45'),
(7, 14, 'Student_2', 'student', '2026-05-20 05:40:42'),
(8, 1, 'amnekku', 'admin', '2026-05-20 08:06:11'),
(9, 1, 'amnekku', 'admin', '2026-05-21 01:30:11'),
(10, 1, 'amnekku', 'admin', '2026-05-21 01:53:16'),
(11, 1, 'amnekku', 'admin', '2026-05-21 04:54:46'),
(12, 1, 'amnekku', 'admin', '2026-05-21 08:24:52'),
(13, 10, 'Student_1', 'student', '2026-05-21 08:25:14'),
(14, 10, 'Student_1', 'student', '2026-05-21 08:25:47'),
(15, 1, 'amnekku', 'admin', '2026-05-21 08:26:00'),
(16, 1, 'amnekku', 'admin', '2026-05-21 08:53:40'),
(17, 1, 'amnekku', 'admin', '2026-05-22 00:39:47'),
(18, 1, 'amnekku', 'admin', '2026-05-22 01:00:12'),
(19, 1, 'amnekku', 'admin', '2026-05-22 02:26:50'),
(20, 1, 'amnekku', 'admin', '2026-05-22 02:37:23'),
(21, 1, 'amnekku', 'admin', '2026-05-22 02:45:18'),
(22, 1, 'amnekku', 'admin', '2026-05-22 03:07:36'),
(23, 1, 'amnekku', 'admin', '2026-05-22 03:23:09'),
(24, 1, 'amnekku', 'admin', '2026-05-22 03:25:04'),
(25, 1, 'amnekku', 'admin', '2026-05-22 03:31:41'),
(26, 1, 'amnekku', 'admin', '2026-05-22 03:49:00'),
(27, 1, 'amnekku', 'admin', '2026-05-22 03:49:08'),
(28, 1, 'amnekku', 'admin', '2026-05-22 03:50:28'),
(29, 1, 'amnekku', 'admin', '2026-05-22 03:51:24'),
(30, 1, 'amnekku', 'admin', '2026-05-22 03:54:52'),
(31, 1, 'amnekku', 'admin', '2026-05-22 04:00:22'),
(32, 1, 'amnekku', 'admin', '2026-05-22 04:01:42'),
(33, 1, 'amnekku', 'admin', '2026-05-22 04:02:55'),
(34, 1, 'amnekku', 'admin', '2026-05-22 05:04:48'),
(35, 1, 'amnekku', 'admin', '2026-05-22 05:10:38'),
(36, 1, 'amnekku', 'admin', '2026-05-22 05:11:56'),
(37, 1, 'amnekku', 'admin', '2026-05-22 05:29:32'),
(38, 1, 'amnekku', 'admin', '2026-05-22 05:30:00'),
(39, 1, 'amnekku', 'admin', '2026-05-22 05:39:58'),
(40, 1, 'amnekku', 'admin', '2026-05-22 05:44:09'),
(41, 9, 'Employee', 'employee', '2026-05-22 06:07:26'),
(42, 10, 'Student_1', 'student', '2026-05-22 06:08:18'),
(43, 1, 'amnekku', 'admin', '2026-05-22 06:08:29'),
(44, 1, 'amnekku', 'admin', '2026-05-22 06:39:30'),
(45, 1, 'amnekku', 'admin', '2026-05-22 07:01:23'),
(46, 10, 'Student_1', 'student', '2026-05-22 07:14:09'),
(47, 1, 'amnekku', 'admin', '2026-05-22 07:14:17'),
(48, 1, 'amnekku', 'admin', '2026-05-25 00:38:41'),
(49, 1, 'amnekku', 'admin', '2026-05-25 02:00:34'),
(50, 1, 'amnekku', 'admin', '2026-05-25 02:01:18'),
(51, 9, 'Employee', 'employee', '2026-05-25 02:07:53'),
(52, 1, 'amnekku', 'admin', '2026-05-25 02:29:58'),
(53, 9, 'Employee', 'employee', '2026-05-25 02:30:20'),
(54, 1, 'amnekku', 'admin', '2026-05-28 00:56:12'),
(55, 1, 'amnekku', 'admin', '2026-05-29 01:07:36'),
(56, 1, 'amnekku', 'admin', '2026-05-29 01:11:52'),
(57, 8, 'admin', 'admin', '2026-05-29 01:12:36'),
(58, 1, 'amnekku', 'admin', '2026-05-29 01:41:38'),
(59, 1, 'amnekku', 'admin', '2026-05-29 02:17:05'),
(60, 1, 'amnekku', 'admin', '2026-05-29 03:12:16'),
(61, 1, 'amnekku', 'admin', '2026-05-29 03:12:38'),
(62, 1, 'amnekku', 'admin', '2026-05-29 03:14:15'),
(63, 8, 'admin', 'admin', '2026-05-29 03:19:45'),
(64, 10, 'Student_1', 'student', '2026-05-29 03:20:18'),
(65, 8, 'admin', 'admin', '2026-05-29 03:21:16'),
(66, 1, 'amnekku', 'admin', '2026-05-29 03:36:41'),
(67, 8, 'admin', 'admin', '2026-05-29 03:37:53'),
(68, 1, 'amnekku', 'admin', '2026-05-29 05:16:00'),
(69, 1, 'amnekku', 'admin', '2026-05-29 05:36:45'),
(70, 1, 'amnekku', 'admin', '2026-05-29 05:58:00'),
(71, 10, 'Student_1', 'student', '2026-05-29 06:29:16'),
(72, 9, 'Employee', 'employee', '2026-05-29 06:30:18'),
(73, 8, 'admin', 'admin', '2026-05-31 08:03:38'),
(74, 10, 'Student_1', 'student', '2026-05-31 08:04:07'),
(75, 1, 'amnekku', 'admin', '2026-05-31 08:12:13'),
(76, 10, 'Student_1', 'student', '2026-05-31 08:27:44'),
(77, 1, 'amnekku', 'admin', '2026-05-31 08:28:25'),
(78, 1, 'amnekku', 'admin', '2026-06-01 00:11:21'),
(79, 1, 'amnekku', 'admin', '2026-06-01 00:16:15'),
(80, 1, 'amnekku', 'admin', '2026-06-01 00:20:01'),
(81, 1, 'amnekku', 'admin', '2026-06-01 00:26:41'),
(82, 10, 'Student_1', 'student', '2026-06-01 00:26:53'),
(83, 10, 'Student_1', 'student', '2026-06-01 00:39:50'),
(84, 10, 'Student_1', 'student', '2026-06-01 00:40:38'),
(85, 1, 'amnekku', 'admin', '2026-06-01 00:43:44'),
(86, 1, 'amnekku', 'admin', '2026-06-01 01:52:32'),
(87, 10, 'Student_1', 'student', '2026-06-01 02:58:19'),
(88, 1, 'amnekku', 'admin', '2026-06-01 02:58:52'),
(89, 10, 'Student_1', 'student', '2026-06-01 02:59:06'),
(90, 1, 'amnekku', 'admin', '2026-06-01 03:58:49'),
(91, 10, 'Student_1', 'student', '2026-06-01 04:52:47'),
(92, 1, 'amnekku', 'admin', '2026-06-01 04:54:51'),
(93, 10, 'Student_1', 'student', '2026-06-01 07:24:31'),
(94, 10, 'Student_1', 'student', '2026-06-01 07:33:33'),
(95, 1, 'amnekku', 'admin', '2026-06-01 07:35:40'),
(96, 1, 'amnekku', 'admin', '2026-06-01 08:13:05'),
(97, 1, 'amnekku', 'admin', '2026-06-02 00:05:24'),
(98, 1, 'amnekku', 'admin', '2026-06-02 00:06:21'),
(99, 1, 'amnekku', 'admin', '2026-06-02 01:18:00'),
(100, 1, 'amnekku', 'admin', '2026-06-02 01:55:05'),
(101, 1, 'amnekku', 'admin', '2026-06-02 02:16:07'),
(102, 10, 'Student_1', 'student', '2026-06-02 02:16:27'),
(103, 1, 'amnekku', 'admin', '2026-06-02 02:45:43'),
(104, 1, 'amnekku', 'admin', '2026-06-02 03:07:30'),
(105, 10, 'Student_1', 'student', '2026-06-02 03:12:59'),
(106, 1, 'amnekku', 'admin', '2026-06-02 03:14:45'),
(107, 10, 'Student_1', 'student', '2026-06-02 03:20:11'),
(108, 10, 'Student_1', 'student', '2026-06-02 03:31:01'),
(109, 10, 'Student_1', 'student', '2026-06-02 03:37:56'),
(110, 1, 'amnekku', 'admin', '2026-06-02 03:38:21'),
(111, 1, 'amnekku', 'admin', '2026-06-02 03:42:14'),
(112, 1, 'amnekku', 'admin', '2026-06-02 03:50:37'),
(113, 8, 'admin', 'admin', '2026-06-02 07:07:45'),
(114, 8, 'admin', 'admin', '2026-06-02 07:07:45'),
(115, 10, 'Student_1', 'student', '2026-06-04 02:12:31'),
(116, 10, 'Student_1', 'student', '2026-06-04 02:16:26'),
(117, 10, 'Student_1', 'student', '2026-06-04 02:38:49'),
(118, 1, 'amnekku', 'admin', '2026-06-04 23:54:21'),
(119, 1, 'amnekku', 'admin', '2026-06-05 00:10:36'),
(120, 10, 'Student_1', 'student', '2026-06-05 00:10:49'),
(121, 1, 'amnekku', 'admin', '2026-06-05 00:13:24'),
(122, 1, 'amnekku', 'admin', '2026-06-05 05:34:17'),
(123, 1, 'amnekku', 'admin', '2026-06-05 05:39:03'),
(124, 8, 'admin', 'admin', '2026-06-05 07:11:30'),
(125, 1, 'amnekku', 'admin', '2026-06-05 07:29:38'),
(126, 1, 'amnekku', 'admin', '2026-06-08 00:37:03'),
(127, 1, 'amnekku', 'admin', '2026-06-08 01:03:07'),
(128, 8, 'admin', 'admin', '2026-06-08 03:31:05'),
(129, 1, 'amnekku', 'admin', '2026-06-08 04:28:47'),
(130, 10, 'Student_1', 'student', '2026-06-08 05:18:18'),
(131, 8, 'admin', 'admin', '2026-06-08 05:34:18'),
(132, 9, 'Employee', 'employee', '2026-06-08 05:34:54'),
(133, 10, 'Student_1', 'student', '2026-06-08 05:44:02'),
(134, 9, 'Employee', 'employee', '2026-06-08 05:44:17'),
(135, 1, 'amnekku', 'admin', '2026-06-08 06:19:28'),
(136, 1, 'amnekku', 'admin', '2026-06-08 06:23:12'),
(137, 1, 'amnekku', 'admin', '2026-06-08 07:57:33'),
(138, 8, 'admin', 'admin', '2026-06-09 02:20:45'),
(139, 1, 'amnekku', 'admin', '2026-06-09 05:39:17'),
(140, 1, 'amnekku', 'admin', '2026-06-09 06:50:55'),
(141, 1, 'amnekku', 'admin', '2026-06-09 08:39:45'),
(142, 1, 'amnekku', 'admin', '2026-06-09 08:43:16'),
(143, 8, 'admin', 'admin', '2026-06-10 03:35:36'),
(144, 10, 'Student_1', 'student', '2026-06-10 03:44:21'),
(145, 1, 'amnekku', 'admin', '2026-06-10 03:54:54'),
(146, 1, 'amnekku', 'admin', '2026-06-10 04:43:55'),
(147, 55, 'cit_', 'student', '2026-06-10 05:01:56'),
(148, 1, 'amnekku', 'admin', '2026-06-10 06:23:24'),
(149, 1, 'amnekku', 'admin', '2026-06-10 07:24:52'),
(150, 56, 'shs_', 'student', '2026-06-10 08:10:19'),
(151, 1, 'amnekku', 'admin', '2026-06-10 08:27:24'),
(152, 1, 'amnekku', 'admin', '2026-06-10 08:29:12'),
(153, 1, 'amnekku', 'admin', '2026-06-10 16:12:30'),
(154, 8, 'admin', 'admin', '2026-06-11 06:57:48'),
(155, 1, 'amnekku', 'admin', '2026-06-15 01:10:59'),
(156, 55, 'cit_', 'student', '2026-06-15 01:11:36'),
(157, 1, 'amnekku', 'admin', '2026-06-15 01:52:14'),
(158, 1, 'amnekku', 'admin', '2026-06-15 05:20:30'),
(159, 55, 'cit_', 'student', '2026-06-15 05:29:14'),
(160, 1, 'amnekku', 'admin', '2026-06-15 05:29:46'),
(161, 8, 'admin', 'admin', '2026-06-15 06:07:16'),
(162, 8, 'admin', 'admin', '2026-06-15 06:20:05'),
(163, 57, 'staff', 'employee', '2026-06-15 06:21:30'),
(164, 1, 'amnekku', 'admin', '2026-06-17 00:22:00'),
(165, 1, 'amnekku', 'admin', '2026-06-17 00:25:50'),
(166, 55, 'cit_', 'student', '2026-06-17 00:27:51'),
(167, 55, 'cit_', 'student', '2026-06-17 00:51:18'),
(168, 55, 'cit_', 'student', '2026-06-17 01:15:54'),
(169, 1, 'amnekku', 'admin', '2026-06-17 01:30:40'),
(170, 1, 'amnekku', 'admin', '2026-06-17 03:15:57'),
(171, 58, 'test', 'student', '2026-06-17 03:26:36'),
(172, 59, 'test2', 'student', '2026-06-17 03:27:06'),
(173, 1, 'amnekku', 'admin', '2026-06-17 03:27:35'),
(174, 60, 'test', 'student', '2026-06-17 03:29:29'),
(175, 11, 'test', 'student', '2026-06-17 03:41:16'),
(176, 12, 'test', 'student', '2026-06-17 03:42:07'),
(177, 1, 'amnekku', 'admin', '2026-06-17 03:45:59'),
(178, 8, 'cit_', 'student', '2026-06-17 03:46:50'),
(179, 1, 'amnekku', 'admin', '2026-06-17 03:51:05'),
(180, 4, 'test', 'student', '2026-06-17 03:57:34'),
(181, 3, 'staff_', 'employee', '2026-06-17 04:44:10'),
(182, 1, 'amnekku', 'admin', '2026-06-17 04:54:34'),
(183, 4, 'student', 'student', '2026-06-17 04:55:30'),
(184, 1, 'amnekku', 'admin', '2026-06-17 05:25:16'),
(185, 1, 'amnekku', 'admin', '2026-06-17 05:44:28'),
(186, 1, 'amnekku', 'admin', '2026-06-17 05:47:55'),
(187, 1, 'amnekku', 'admin', '2026-06-17 05:53:19'),
(188, 1, 'amnekku', 'admin', '2026-06-17 06:24:36'),
(189, 1, 'amnekku', 'admin', '2026-06-17 06:32:44'),
(190, 1, 'amnekku', 'admin', '2026-06-17 06:59:50'),
(191, 4, 'student', 'student', '2026-06-17 07:59:59'),
(192, 1, 'amnekku', 'admin', '2026-06-18 00:16:08'),
(193, 1, 'amnekku', 'admin', '2026-06-18 01:19:59'),
(194, 1, 'amnekku', 'admin', '2026-06-18 01:42:01'),
(195, 1, 'amnekku', 'admin', '2026-06-18 04:35:28'),
(196, 4, 'student', 'student', '2026-06-18 05:56:17'),
(197, 1, 'amnekku', 'admin', '2026-06-18 06:11:18'),
(198, 1, 'amnekku', 'admin', '2026-06-18 06:29:03'),
(199, 1, 'amnekku', 'admin', '2026-06-18 06:50:49'),
(200, 1, 'amnekku', 'admin', '2026-06-18 07:00:48'),
(201, 1, 'amnekku', 'admin', '2026-06-18 07:32:46'),
(202, 1, 'amnekku', 'admin', '2026-06-23 01:34:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_file` (`user_id`,`file_id`),
  ADD KEY `file_id` (`file_id`);

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `communities`
--
ALTER TABLE `communities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ebooks`
--
ALTER TABLE `ebooks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `community_id` (`collection_id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `semester_settings`
--
ALTER TABLE `semester_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `user_logins`
--
ALTER TABLE `user_logins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_time` (`login_time`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookmarks`
--
ALTER TABLE `bookmarks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `communities`
--
ALTER TABLE `communities`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `ebooks`
--
ALTER TABLE `ebooks`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user_logins`
--
ALTER TABLE `user_logins`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=203;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bookmarks`
--
ALTER TABLE `bookmarks`
  ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `files` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ebooks`
--
ALTER TABLE `ebooks`
  ADD CONSTRAINT `ebooks_ibfk_1` FOREIGN KEY (`collection_id`) REFERENCES `communities` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
