package model

type EngineerUserWithLatestAbilityReport struct {
	ID              uint64  `db:"id" json:"id"`
	LoginName       string  `db:"login_name" json:"loginName"`
	DisplayName     string  `db:"display_name" json:"displayName"`
	PhotoURL        string  `db:"photo_url" json:"photoURL"`
	ProjectScore    *uint64 `db:"project_score" json:"projectScore"`
	RepositoryScore *uint64 `db:"repository_score" json:"repositoryScore"`
	CommitScore     *uint64 `db:"commit_score" json:"commitScore"`
	PullreqScore    *uint64 `db:"pullreq_score" json:"pullreqScore"`
	IssueScore      *uint64 `db:"issue_score" json:"issueScore"`
	SpeedScore      *uint64 `db:"speed_score" json:"speedScore"`
}
