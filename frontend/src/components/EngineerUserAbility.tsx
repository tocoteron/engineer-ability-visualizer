import { Container, Grid } from '@material-ui/core';
import React from 'react';
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityType from '../models/EngineerUserAbilityReport'

interface Props {
  engineerUser: EngineerUser;
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
    <Container>
      <div className="user">
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <img
              width={200}
              height={200}
              src={props.engineerUser.photoURL}
              style={{
                borderRadius: "50%",
              }}
            ></img>
          </Grid>
          <Grid item xs={9}>
            <h2>{props.engineerUser.displayName}さん</h2>
            <h3>GitHubアカウント: <a href={`https://github.com/${props.engineerUser.loginName}`}>{props.engineerUser.loginName}</a></h3>
          </Grid>
        </Grid>
      </div>
      <div className="ability">
        <h2>エンジニアスコア {
          calcDetectabilityScore(props.abilities[0]) +
          calcSolvingScore(props.abilities[0]) +
          calcSpeedScore(props.abilities[0])
        }</h2>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3>発見力 {calcDetectabilityScore(props.abilities[0])}</h3>
            <p>イシュースコア {props.abilities[0].issueScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3>解決力 {calcSolvingScore(props.abilities[0])}</h3>
            <p>プロジェクトスコア {props.abilities[0].projectScore}</p>
            <p>リポジトリスコア {props.abilities[0].repositoryScore}</p>
            <p>コミットスコア {props.abilities[0].commitScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3>スピード {calcSpeedScore(props.abilities[0])}</h3>
            <p>コミットスピードスコア {props.abilities[0].speedScore}</p>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}