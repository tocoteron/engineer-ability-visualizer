export default interface EngineerUserAbility {
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