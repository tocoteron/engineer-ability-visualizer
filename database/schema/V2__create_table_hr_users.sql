CREATE TABLE `hr_users` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `firebase_uid` varchar(255) UNIQUE,
  `email` varchar(255),
  `first_name` varchar(255),
  `last_name` varchar(255),
  `company_name` varchar(255),
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;