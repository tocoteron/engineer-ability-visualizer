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
        console.log("engineerUser", engineerUser);

        let abilityReports = await API.getEngineerUserAbilityReports(Number(engineerUserId));
        abilityReports = abilityReports.map((abilityReport) => ({
          ...abilityReport,
          createdAt: typeof(abilityReport.createdAt) === "string"
            ? new Date(abilityReport.createdAt)
            : abilityReport.createdAt,
        }));
        console.log("abilityReports", abilityReports);

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