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
	return typeof(engineerUser.projectScore) === "number"
    && typeof(engineerUser.repositoryScore) === "number"
    && typeof(engineerUser.commitScore) === "number"
    && typeof(engineerUser.pullreqScore) === "number"
    && typeof(engineerUser.issueScore) === "number"
    && typeof(engineerUser.repositoryScore) === "number"
    && typeof(engineerUser.speedScore) === "number"
}