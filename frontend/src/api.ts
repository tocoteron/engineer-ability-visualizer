import EngineerUserAbilityReportType from "./models/EngineerUserAbilityReport";

const API_BASE_URL = "http://localhost:1323";

async function getEngineerUserAbilityReports(engineerUserId: number): Promise<EngineerUserAbilityReportType[]> {
    const res = await fetch(`${API_BASE_URL}/user/engineer/${engineerUserId}/ability`);
    const json = await res.json();

    return json;
}

export default {
    getEngineerUserAbilityReports,
}