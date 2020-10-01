package model

import "time"

type EngineerUserAbilityReport struct {
	ID              uint64    `db:"id" json:"id"`
	EngineerUserID  uint64    `db:"engineer_users_id" json:"enginerUserId"`
	ProjectScore    uint64    `db:"project_score" json:"projectScore"`
	RepositoryScore uint64    `db:"repository_score" json:"repositoryScore"`
	CommitScore     uint64    `db:"commit_score" json:"commitScore"`
	PullreqScore    uint64    `db:"pullreq_score" json:"pullreqScore"`
	IssueScore      uint64    `db:"issue_score" json:"issueScore"`
	SpeedScore      uint64    `db:"speed_score" json:"speedScore"`
	CreatedAt       time.Time `db:"created_at" json:"createdAt"`
}
