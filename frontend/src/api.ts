import EngineerUserAbilityReport from "./models/EngineerUserAbilityReport";
import EngineerUser from "./models/EngineerUser";

const API_BASE_URL = process.env.REACT_APP_BACKEND_API_BASE;

const toJson = async (res: Response) => {
    const js = await res.json()
    if (res.ok) {
        return js
    } else {
        throw new Error(js.message)
    }
}

async function testHRUser(idToken: string) {
    const res = await fetch(`${API_BASE_URL}/`, {
        headers: new Headers({
            Authorization: `Bearer ${idToken}`
        }),
    })

    return await toJson(res);
};

async function getEngineerList(idToken: string) {
    const res = await fetch(`${API_BASE_URL}/hr_user/engineers`, {
        headers: new Headers({
            Authorization: `Bearer ${idToken}`
        }),
    })

    return await toJson(res);
}

async function addEngineerToList(idToken: string, githubLoginName: string) {
    const res = await fetch(`${API_BASE_URL}/hr_user/engineers/${githubLoginName}`, {
        method: "POST",
        headers: new Headers({
            Authorization: `Bearer ${idToken}`
        }),
    })

    return await toJson(res);
};

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
    testHRUser,
    getEngineerList,
    addEngineerToList,
    getEngineerUserAbilityReports,
    getEngineerUser,
}