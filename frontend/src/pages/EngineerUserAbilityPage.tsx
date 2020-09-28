import React, { useEffect, useState } from 'react';
import EngineerUserAbilityType from '../models/EngineerUserAbility';
import EngineerUserAbility from '../components/EngineerUserAbility';
import API from '../api';

export default function EngineerUserAbilityPage() {
  const [abilities, setAbilities] = useState<EngineerUserAbilityType[]>([]);

  useEffect(() => {
    const f = async () => {
      const json = await API.getEngineerUserAbilities(0);
      console.log(json);

      setAbilities(json);
    }

    f();
  }, [])

  return (
    <div>
    { abilities !== undefined &&
      <EngineerUserAbility
        abilities={abilities}
      />
    }
    </div>
  );
}