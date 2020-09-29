import EngineerUserAbilityReport from "./models/EngineerUserAbilityReport";
import EngineerUser from "./models/EngineerUser";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE;

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