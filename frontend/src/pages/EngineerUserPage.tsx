import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport from '../models/EngineerUserAbilityReport';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';
import mock from '../mock';

export default function EngineerUserAbilityPage() {
  const { engineerUserId } = useParams<{engineerUserId: string}>();
  const [engineerUser, setEngineerUser] = useState<EngineerUser>();
  const [abilityReports, setAbilityReports] = useState<EngineerUserAbilityReport[]>([]);

  /*
  useEffect(() => {
    console.log("ID", engineerUserId)

    const mockEngineerUser: EngineerUser = {
      id: Number(engineerUserId),
      loginName: `github-user-${engineerUserId}`,
      displayName: `エンジニア${engineerUserId}号`,
      photoURL: "https://avatars3.githubusercontent.com/u/51188956?v=4",
    };

    const range = Array(10).fill(0).map((v, i) => i + 1);
    const mockAbilityReports: EngineerUserAbilityReport[] = range.map<EngineerUserAbilityReport>((i) => {
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() + i);
      return {
        id: i,
        engineerUserId: Number(engineerUserId),
        projectScore: mock.getRandomInt(0, 1000),
        repositoryScore: mock.getRandomInt(0, 1000),
        commitScore: mock.getRandomInt(0, 1000),
        pullreqScore: mock.getRandomInt(0, 1000),
        issueScore: mock.getRandomInt(0, 1000),
        speedScore: mock.getRandomInt(0, 1000),
        createdAt,
      }
    });

    setEngineerUser(mockEngineerUser);
    setAbilityReports(mockAbilityReports);
  }, [engineerUserId])
  */

  useEffect(() => {
    const f = async () => {
      try {
        const engineerUser = await API.getEngineerUser(Number(engineerUserId));
        console.log(engineerUser);

        let abilityReports = await API.getEngineerUserAbilityReports(Number(engineerUserId));
        abilityReports = abilityReports.map((abilityReport) => ({
          ...abilityReport,
          createdAt: typeof(abilityReport.createdAt) === "string"
            ? new Date(abilityReport.createdAt)
            : abilityReport.createdAt,
        }));
        console.log(abilityReports);

        setEngineerUser(engineerUser);
        setAbilityReports(abilityReports);
      } catch (err) {
        console.error(err);
      }
    }

    f();
  }, [engineerUserId])

  return (
    <div>
    { engineerUser && abilityReports.length > 0 &&
      <EngineerUserAbility
        engineerUser={engineerUser}
        abilities={abilityReports}
      />
    }
    </div>
  );
}