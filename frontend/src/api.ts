import EngineerUserAbilityType from "./models/EngineerUserAbility";

const API_BASE_URL = "http://localhost:1323";

async function getEngineerUserAbilities(engineerUserId: number): Promise<EngineerUserAbilityType[]> {
    const res = await fetch(`${API_BASE_URL}/user/engineer/${engineerUserId}/ability`);
    const json = await res.json();

    return json;
}

export default {
    getEngineerUserAbilities,
}