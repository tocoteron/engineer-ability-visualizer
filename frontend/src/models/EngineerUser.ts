export default interface EngineerUser {
	id: number
	loginName: string
	displayName: string
	photoURL: string
	projectScore?: number | null
	repositoryScore?: number | null
	commitScore?: number | null
	pullreqScore?: number | null
	issueScore?: number | null
	speedScore?: number | null
}

export function hasScore(engineerUser: EngineerUser) {
	return engineerUser.projectScore
    && engineerUser.repositoryScore
    && engineerUser.commitScore
    && engineerUser.pullreqScore
    && engineerUser.issueScore
    && engineerUser.repositoryScore
    && engineerUser.speedScore
}