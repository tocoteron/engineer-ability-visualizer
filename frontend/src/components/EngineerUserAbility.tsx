import { Container, Divider, Grid, makeStyles, Theme, Typography, withStyles } from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React from 'react';
import EngineerUser from '../models/EngineerUser';
import EngineerUserAbilityReport, {
  calcEngineerScore,
  calcDetectabilityScore,
  calcSolvingScore,
  calcSpeedScore
} from '../models/EngineerUserAbilityReport'
import MaterialTooltip  from '@material-ui/core/Tooltip';
import {CartesianGrid, Line, LineChart, XAxis, Tooltip, ResponsiveContainer, YAxis} from 'recharts';

interface Props {
  engineerUser: EngineerUser;
  abilities: EngineerUserAbilityReport[];
  rank: {
    engineer: number,
    detectability: number,
    solving: number,
    speed: number,
  }
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
  },
  sectionContainer: {
    marginBottom: theme.spacing(3),
  }
}));

const HtmlTooltip = withStyles((theme: Theme) => ({
  tooltip: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: "80%",
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}))(MaterialTooltip);

const engineerScoreToolTip = (
  <React.Fragment>
    <Typography color="inherit">エンジニアスコアとは？</Typography>
    <Typography>
      エンジニアの発見力/解決力/スピードの3つのスコアを加算したものです。
    </Typography>
  </React.Fragment>
);

const detectabilityScoreToolTip = (
  <React.Fragment>
    <Typography color="inherit">発見力とは？</Typography>
    <Typography>
      課題を発見することができるかといった指標です。
    </Typography>
    <Typography>
      GitHubのイシューをどれだけ作成したかといった情報から計算されます。
    </Typography>
  </React.Fragment>
);

const solvingScoreToolTip = (
  <React.Fragment>
    <Typography color="inherit">解決力とは？</Typography>
    <Typography>
      課題にどれだけ取り組むことができるかといった指標です。
    </Typography>
    <Typography>
      GitHubのプロジェクトの数/リポジトリ数/コミット数から計算されます。
    </Typography>
  </React.Fragment>
);

const speedScoreToolTip = (
  <React.Fragment>
    <Typography color="inherit">スピードとは？</Typography>
    <Typography>
      課題にどれだけ素早く取り組むことができるかといった指標です。
    </Typography>
    <Typography>
      GitHubの各リポジトリにおける時間あたりのコミット数から計算されます。
    </Typography>
  </React.Fragment>
);


export default function EngineerUserAbility(props: Props) {
  const classes = useStyles();
  const { engineerUser, abilities, rank } = props;

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
      <div className={classes.sectionContainer}>
        <h2 className={classes.engineerScore}>
          エンジニアスコア {calcEngineerScore(abilities[0])} ({rank.engineer}位)
          <HtmlTooltip title={engineerScoreToolTip}>
            <HelpOutlineIcon></HelpOutlineIcon>
          </HtmlTooltip>
        </h2>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <h3 className={classes.detectabilityScore}>
              発見力 {calcDetectabilityScore(abilities[0]) }({rank.detectability}位)
              <HtmlTooltip title={detectabilityScoreToolTip}>
                <HelpOutlineIcon></HelpOutlineIcon>
              </HtmlTooltip>
            </h3>
            <p>イシュースコア {abilities[0].issueScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.solvingScore}>
              解決力 {calcSolvingScore(abilities[0])} ({rank.solving}位)
              <HtmlTooltip title={solvingScoreToolTip}>
                <HelpOutlineIcon></HelpOutlineIcon>
              </HtmlTooltip>
            </h3>
            <p>プロジェクトスコア {abilities[0].projectScore}</p>
            <p>リポジトリスコア {abilities[0].repositoryScore}</p>
            <p>コミットスコア {abilities[0].commitScore}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 className={classes.speedScore}>
              スピード {calcSpeedScore(abilities[0])} ({rank.speed}位)
              <HtmlTooltip title={speedScoreToolTip}>
                <HelpOutlineIcon></HelpOutlineIcon>
              </HtmlTooltip>
            </h3>
            <p>コミットスピードスコア {abilities[0].speedScore}</p>
          </Grid>
        </Grid>
      </div>
      <div className="chart">
        <ResponsiveContainer width="95%" height={500}>
          <LineChart
            data={abilities.map((ability) => ({
              engineerScore: calcEngineerScore(ability), 
              detectabilityScore: calcDetectabilityScore(ability),
              solvingScore: calcSolvingScore(ability),
              speedScore: calcSpeedScore(ability),
              createdAt: ability.createdAt.getTime(),
            }))}
          >
            <XAxis
              dataKey="createdAt"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(createdAt: number) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(createdAt) => {
                return new Date(createdAt).toLocaleDateString();
              }}
            />
            <CartesianGrid stroke="#e5e5e5" />
            <Line type="monotone" name="エンジニアスコア" dataKey="engineerScore" stroke={engineerScoreColor} />
            <Line type="monotone" name="発見力" dataKey="detectabilityScore" stroke={detectabilityScoreColor} />
            <Line type="monotone" name="解決力" dataKey="solvingScore" stroke={solvingScoreColor} />
            <Line type="monotone" name="スピード" dataKey="speedScore" stroke={speedScoreColor} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Container>
  );
}