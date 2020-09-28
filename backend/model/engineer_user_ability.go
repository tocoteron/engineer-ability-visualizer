package model

import "time"

type EngineerUserAbility struct {
	ID              uint64
	EngineerUserID  uint64
	ProjectPoint    uint64
	RepositoryPoint uint64
	CommitPoint     uint64
	PullreqPoint    uint64
	IssuePoint      uint64
	SpeedPoint      uint64
	CreatedAt       time.Time
}
