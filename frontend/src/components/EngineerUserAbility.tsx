import React from 'react';
import EngineerUserAbilityType from '../models/EngineerUserAbilityReport'

interface Props {
  abilities: EngineerUserAbilityType[];
}

export default function EngineerUserAbility(props: Props) {
  return (
    <div>
    { props.abilities.map((ability) => {
      return (
        <div key={ability.id}>
          <p>{ability.id}</p>
          <p>{ability.engineerUserId}</p>
          <p>{ability.projectScore}</p>
          <p>{ability.repositoryScore}</p>
          <p>{ability.commitScore}</p>
          <p>{ability.pullreqScore}</p>
          <p>{ability.issueScore}</p>
          <p>{ability.speedScore}</p>
          <p>{ability.createdAt}</p>
        </div>
      );
    })}
    </div>
  );
}