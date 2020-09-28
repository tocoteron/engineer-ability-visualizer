package model

import "time"

type EngineerUserAbility struct {
	ID              uint64
	EngineerUserID  uint64
	ProjectScore    uint64
	RepositoryScore uint64
	CommitScore     uint64
	PullreqScore    uint64
	IssueScore      uint64
	SpeedScore      uint64
	CreatedAt       time.Time
}
