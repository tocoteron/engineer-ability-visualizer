import EngineerUserAbilityReport from "./models/EngineerUserAbilityReport";
import EngineerUser from "./models/EngineerUser";

const API_BASE_URL = "http://localhost:1323";

async function getEngineerUserAbilityReports(engineerUserId: number) {
    const res = await fetch(`${API_BASE_URL}/user/engineer/${engineerUserId}/ability`);
    const json: EngineerUserAbilityReport[] = await res.json();

    return json;
}

async function getEngineerUser(engineerUserId: number) {
    const res = await fetch(`${API_BASE_URL}/user/engineer/${engineerUserId}`);
    const json: EngineerUser  = await res.json();

    return json;
}

export default {
    getEngineerUserAbilityReports,
    getEngineerUser,
}