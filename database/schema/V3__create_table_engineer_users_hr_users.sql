CREATE TABLE `engineer_users_hr_users` (
  `engineer_users_id` int unsigned,
  `hr_users_id` int unsigned,
  PRIMARY KEY (`engineer_users_id`, `hr_users_id`),
  FOREIGN KEY (`engineer_users_id`) REFERENCES `engineer_users` (`id`),
  FOREIGN KEY (`hr_users_id`) REFERENCES `hr_users` (`id`)
);