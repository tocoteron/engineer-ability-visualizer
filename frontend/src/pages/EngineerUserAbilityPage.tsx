import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport from '../models/EngineerUserAbilityReport';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';

export default function EngineerUserAbilityPage() {
  const { engineerUserId } = useParams<{engineerUserId: string}>();
  const [engineerUser, setEngineerUser] = useState<EngineerUser>();
  const [abilityReports, setAbilityReports] = useState<EngineerUserAbilityReport[]>([]);

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

  return (
    <div>
    { abilityReports && engineerUser &&
      <EngineerUserAbility
        abilities={abilityReports}
      />
    }
    </div>
  );
}