import { Container, Divider, Grid, makeStyles } from '@material-ui/core';
import React from 'react';
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityType from '../models/EngineerUserAbilityReport'
import {CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer} from 'recharts';

interface Props {
  engineerUser: EngineerUser;
  abilities: EngineerUserAbilityType[];
}

const engineerScoreColor = "#333";
const detectabilityScoreColor = "#f44";
const solvingScoreColor = "#3d3";
const speedScoreColor = "#33f";

const useStyles = makeStyles((theme) => ({
  engineerScore: {
    color: engineerScoreColor,
  },
  detectabilityScore: {
    color: detectabilityScoreColor,
  },
  solvingScore: {
    color: solvingScoreColor,
  },
  speedScore: {
    color: speedScoreColor,
  }
}));

export default function EngineerUserAbility(props: Props) {
  const classes = useStyles();
  const { engineerUser, abilities } = props;

  function calcEngineerScore(ability: EngineerUserAbilityType) {
    return calcDetectabilityScore(ability)
      + calcSolvingScore(ability)
      + calcSpeedScore(ability);
  }

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
              src={engineerUser.photoURL}
              style={{
                borderRadius: "50%",
              }}
            ></img>
          </Grid>
          <Grid item xs={9}>
            <h2>{engineerUser.displayName}さん</h2>
            <h3>GitHubアカウント: <a href={`https://github.com/${engineerUser.loginName}`}>{engineerUser.loginName}</a></h3>
          </Grid>
        </Grid>
      </div>
      <div className="ability">
        <h2 className={classes.engineerScore}>エンジニアスコア {calcEngineerScore(abilities[0])}</h2>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3 className={classes.detectabilityScore}>発見力 {calcDetectabilityScore(abilities[0])}</h3>
            <p>イシュースコア {abilities[0].issueScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.solvingScore}>解決力 {calcSolvingScore(abilities[0])}</h3>
            <p>プロジェクトスコア {abilities[0].projectScore}</p>
            <p>リポジトリスコア {abilities[0].repositoryScore}</p>
            <p>コミットスコア {abilities[0].commitScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.speedScore}>スピード {calcSpeedScore(abilities[0])}</h3>
            <p>コミットスピードスコア {abilities[0].speedScore}</p>
          </Grid>
        </Grid>
      </div>
      <div className="chart">
        <ResponsiveContainer width="95%" height={400}>
          <LineChart
            data={abilities.map((ability) => ({
              engineerScore: calcEngineerScore(ability), 
              detectabilityScore: calcDetectabilityScore(ability),
              solvingScore: calcSolvingScore(ability),
              speedScore: calcSpeedScore(ability),
              createdAt: ability.createdAt.getTime(),
            }))}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <XAxis
              dataKey="createdAt"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(createdAt: number) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <Tooltip
              labelFormatter={(createdAt) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <CartesianGrid stroke="#e5e5e5" />
            <Line type="monotone" name="エンジニアスコア" dataKey="engineerScore" stroke={engineerScoreColor} yAxisId={0} />
            <Line type="monotone" name="発見力" dataKey="detectabilityScore" stroke={detectabilityScoreColor} yAxisId={1} />
            <Line type="monotone" name="解決力" dataKey="solvingScore" stroke={solvingScoreColor} yAxisId={2} />
            <Line type="monotone" name="スピード" dataKey="speedScore" stroke={speedScoreColor} yAxisId={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}