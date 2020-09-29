import React from 'react';
import EngineerUserAbilityType from '../models/EngineerUserAbilityReport'

interface Props {
  abilities: EngineerUserAbilityType[];
}

export default function EngineerUserAbility(props: Props) {
  function calcDetectabilityScore(ability: EngineerUserAbilityType) {
    return ability.issueScore;
  }

  function calcSolvingScore(ability: EngineerUserAbilityType) {
    return ability.projectScore
      + ability.repositoryScore
      + ability.commitScore
      + ability.pullreqScore;
  }

  function calcSpeedScore(ability: EngineerUserAbilityType) {
    return ability.speedScore;
  }

  return (
    <div>
    { props.abilities.map((ability) => {
      return (
        <div key={ability.id}>
          <h2>能力</h2>
          <div>
            <h3>発見力 {calcDetectabilityScore(ability)}</h3>
            <p>{ability.issueScore}</p>
          </div>
          <div>
            <h3>解決力 {calcSolvingScore(ability)}</h3>
            <p>プロジェクトスコア {ability.projectScore}</p>
            <p>リポジトリスコア {ability.repositoryScore}</p>
            <p>コミットスコア {ability.commitScore}</p>
            <p>プルリクエストスコア {ability.pullreqScore}</p>
          </div>
          <div>
            <h3>スピード {calcSpeedScore(ability)}</h3>
            <p>{ability.speedScore}</p>
          </div>
        </div>
      );
    })}
    </div>
  );
}