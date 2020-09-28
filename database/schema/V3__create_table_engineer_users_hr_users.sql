CREATE TABLE `engineer_users_hr_users` (
  `engineer_user_id` int unsigned,
  `hr_user_id` int unsigned,
  PRIMARY KEY (`engineer_user_id`, `hr_user_id`),
  FOREIGN KEY (`engineer_user_id`) REFERENCES `engineer_user` (`id`),
  FOREIGN KEY (`hr_user_id`) REFERENCES `hr_user` (`id`)
);