CREATE TABLE `engineer_users_hr_users` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `engineer_users_id` int unsigned,
  `hr_users_id` int unsigned,
  FOREIGN KEY (`engineer_users_id`) REFERENCES `engineer_users` (`id`) ON UPDATE CASCADE,
  FOREIGN KEY (`hr_users_id`) REFERENCES `hr_users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;