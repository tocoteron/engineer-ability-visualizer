package model

import "time"

type EngineerUserAbilityReport struct {
	ID              uint64    `json:"id"`
	EngineerUserID  uint64    `json:"enginerUserId"`
	ProjectScore    uint64    `json:"projectScore"`
	RepositoryScore uint64    `json:"repositoryScore"`
	CommitScore     uint64    `json:"commitScore"`
	PullreqScore    uint64    `json:"pullreqScore"`
	IssueScore      uint64    `json:"issueScore"`
	SpeedScore      uint64    `json:"speedScore"`
	CreatedAt       time.Time `json:"createdAt"`
}
