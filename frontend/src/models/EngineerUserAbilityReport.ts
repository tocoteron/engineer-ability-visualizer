export default interface EngineerUserAbilityReport {
  id: number;
  engineerUserId: number;
  projectScore: number;
  repositoryScore: number;
  commitScore: number;
  pullreqScore: number;
  issueScore: number;
  speedScore: number;
  createdAt: Date;
}

export function calcEngineerScore(ability: EngineerUserAbilityReport) {
  return calcDetectabilityScore(ability)
    + calcSolvingScore(ability)
    + calcSpeedScore(ability);
}

export function calcDetectabilityScore(ability: EngineerUserAbilityReport) {
  return ability.issueScore;
}

export function calcSolvingScore(ability: EngineerUserAbilityReport) {
  console.log(ability)
  return ability.projectScore
    + ability.repositoryScore
    + ability.commitScore
    + ability.pullreqScore;
}

export function calcSpeedScore(ability: EngineerUserAbilityReport) {
  return ability.speedScore;
}