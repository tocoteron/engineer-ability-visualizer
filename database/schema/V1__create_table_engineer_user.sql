CREATE TABLE `engineer_users` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `firebase_uid` varchar(255) UNIQUE NOT NULL,
  `github_token` varchar(255) UNIQUE NOT NULL,
  `email` varchar(255),
  `login_name` varchar(255) NOT NULL,
  `display_name` varchar(255) NOT NULL,
  `photo_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;