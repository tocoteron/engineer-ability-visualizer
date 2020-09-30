import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport from '../models/EngineerUserAbilityReport';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export default function EngineerUserAbilityPage() {
  const { engineerUserId } = useParams<{engineerUserId: string}>();
  const [engineerUser, setEngineerUser] = useState<EngineerUser>();
  const [abilityReports, setAbilityReports] = useState<EngineerUserAbilityReport[]>([]);

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
      createdAt.setHours(createdAt.getHours() - 1);
      return {
        id: i,
        engineerUserId: Number(engineerUserId),
        projectScore: getRandomInt(0, 1000),
        repositoryScore: getRandomInt(0, 1000),
        commitScore: getRandomInt(0, 1000),
        pullreqScore: getRandomInt(0, 1000),
        issueScore: getRandomInt(0, 1000),
        speedScore: getRandomInt(0, 1000),
        createdAt,
      }
    });

    setEngineerUser(mockEngineerUser);
    setAbilityReports(mockAbilityReports);
  }, [engineerUserId])

  /*
  useEffect(() => {
    const f = async () => {
      try {
        const engineerUser = await API.getEngineerUser(Number(engineerUserId));
        console.log(engineerUser);

        const abilityReports = await API.getEngineerUserAbilityReports(Number(engineerUserId));
        console.log(abilityReports);

        setEngineerUser(engineerUser);
        setAbilityReports(abilityReports);
      } catch (err) {
        console.error(err);
      }
    }

    f();
  }, [])
  */

  return (
    <div>
    { abilityReports && engineerUser &&
      <EngineerUserAbility
        engineerUser={engineerUser}
        abilities={abilityReports}
      />
    }
    </div>
  );
}