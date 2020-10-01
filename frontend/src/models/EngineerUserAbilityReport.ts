import EngineerUser, { hasScore } from "./EngineerUser";

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
  return ability.projectScore
    + ability.repositoryScore
    + ability.commitScore
    + ability.pullreqScore;
}

export function calcSpeedScore(ability: EngineerUserAbilityReport) {
  return ability.speedScore;
}

export function getEngineerAbilityReport(engineerUser: EngineerUser) {
  if (hasScore(engineerUser)) {
    const ability: EngineerUserAbilityReport = {
      id: 0,
      engineerUserId: engineerUser.id,
      projectScore: engineerUser.projectScore!,
      repositoryScore: engineerUser.repositoryScore!,
      commitScore: engineerUser.commitScore!,
      pullreqScore: engineerUser.pullreqScore!,
      issueScore: engineerUser.issueScore!,
      speedScore: engineerUser.speedScore!,
      createdAt: new Date(),
    };
    return ability;
  } else {
    const ability: EngineerUserAbilityReport = {
      id: 0,
      engineerUserId: engineerUser.id,
      projectScore: 0,
      repositoryScore: 0,
      commitScore: 0,
      pullreqScore: 0,
      issueScore: 0,
      speedScore: 0,
      createdAt: new Date(),
    };
    return ability;
  }
}

export function compareByEngineerScore(a: EngineerUser, b: EngineerUser) {
  const aa = getEngineerAbilityReport(a);
  const ba = getEngineerAbilityReport(b);
  return calcEngineerScore(ba) - calcEngineerScore(aa);
}

export function compareByDetectabilityScore(a: EngineerUser, b: EngineerUser) {
  const aa = getEngineerAbilityReport(a);
  const ba = getEngineerAbilityReport(b);
  return calcDetectabilityScore(ba) - calcDetectabilityScore(aa);
}

export function compareBySolvingScore(a: EngineerUser, b: EngineerUser) {
  const aa = getEngineerAbilityReport(a);
  const ba = getEngineerAbilityReport(b);
  return calcSolvingScore(ba) - calcSolvingScore(aa);
}

export function compareBySpeedScore(a: EngineerUser, b: EngineerUser) {
  const aa = getEngineerAbilityReport(a);
  const ba = getEngineerAbilityReport(b);
  return calcSpeedScore(ba) - calcSpeedScore(aa);
}