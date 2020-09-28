import React, { useEffect, useState } from 'react';
import EngineerUserAbilityReportType from '../models/EngineerUserAbilityReport';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';

export default function EngineerUserAbilityPage() {
  const [abilityReports, setAbilityReports] = useState<EngineerUserAbilityReportType[]>([]);

  useEffect(() => {
    const f = async () => {
      const json = await API.getEngineerUserAbilityReports(0);
      console.log(json);

      setAbilityReports(json);
    }

    f();
  }, [])

  return (
    <div>
    { abilityReports !== undefined &&
      <EngineerUserAbility
        abilities={abilityReports}
      />
    }
    </div>
  );
}