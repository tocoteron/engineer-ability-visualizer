CREATE TABLE `engineer_users_ability_reports` (
  `id` int unsigned PRIMARY KEY AUTO_INCREMENT,
  `engineer_users_id` int unsigned NOT NULL,
  `project_score` int unsigned NOT NULL,
  `repository_score` int unsigned NOT NULL,
  `commit_score` int unsigned NOT NULL,
  `pullreq_score` int unsigned NOT NULL,
  `issue_score` int unsigned NOT NULL,
  `speed_score` int unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`engineer_users_id`) REFERENCES `engineer_users` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;