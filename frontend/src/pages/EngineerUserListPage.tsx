import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, Grid, makeStyles, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import SpeedIcon from '@material-ui/icons/Speed';
import mock from '../mock';
import EngineerUser, { hasScore } from '../models/EngineerUser';
import EngineerUserAbilityReport, {
  calcEngineerScore,
  calcDetectabilityScore,
  calcSolvingScore,
  calcSpeedScore
} from '../models/EngineerUserAbilityReport';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import api from '../api';

const range = Array(10).fill(0).map((v, i) => i + 1);
const mockEngineerUsers: EngineerUser[] = range.map<EngineerUser>((i) => {
  const id = mock.getRandomInt(0, 1000);
  return {
    id,
    loginName: `github-user-${id}`,
    displayName: `エンジニア${id}号`,
    photoURL: "https://avatars3.githubusercontent.com/u/51188956?v=4",
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  formContainer: {
    marginBottom: theme.spacing(2),
  },
  addButtonContainer: {
    display: 'flex',
  },
  errorMessage: {
    color: "#f00",
  },
  scoreContaier: {
    display: "flex",
  },
  engineerScore: {
    display: "flex",
    alignItems: 'center',
    marginRight: theme.spacing(5),
  },
  score: {
    display: "flex",
    alignItems: 'center',
    marginRight: theme.spacing(2),
  }
}));

type FormChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

function EngineerUserCard(props: {engineerUser: EngineerUser}) {
  const classes = useStyles();
  const engineerUser = props.engineerUser;
  const ability: EngineerUserAbilityReport = {
    id: 0,
    engineerUserId: engineerUser.id,
    projectScore: engineerUser.projectScore!,
    repositoryScore: engineerUser.projectScore!,
    commitScore: engineerUser.projectScore!,
    pullreqScore: engineerUser.projectScore!,
    issueScore: engineerUser.projectScore!,
    speedScore: engineerUser.projectScore!,
    createdAt: new Date(),
  };

  return (
    <div className="engineer">
      <Grid container spacing={3}>
        <Grid item xs={2}>
          <img
            width="100"
            height="100"
            src={props.engineerUser.photoURL}
            style={{
              borderRadius: "50%",
            }}
          ></img>
        </Grid>
        <Grid item xs={8}>
          <h2>
            {engineerUser.displayName}さん
            (
            { hasScore(engineerUser) &&
              <Link to={`/engineers/${engineerUser.id}`}>
                詳細ページ
              </Link>
            }
            {
              !hasScore(engineerUser) &&
              <>スコア未算出</>
            }
            )
          </h2>
          <h3>GitHubアカウント:
            <a href={`https://github.com/${props.engineerUser.loginName}`} target="_blank">
              {props.engineerUser.loginName}
            </a>
          </h3>
          { hasScore(engineerUser) &&
            <div className={classes.scoreContaier}>
              <div className={classes.engineerScore}>
                <AccountCircleIcon></AccountCircleIcon>
                <p>{calcEngineerScore(ability)}</p>
              </div>
              <div className={classes.score}>
                <SearchIcon></SearchIcon>
                <p>{calcDetectabilityScore(ability)}</p>
              </div>
              <div className={classes.score}>
                <DoneOutlineIcon></DoneOutlineIcon>
                <p>{calcSolvingScore(ability)}</p>
              </div>
              <div className={classes.score}>
                <SpeedIcon></SpeedIcon>
                <p>{calcSpeedScore(ability)}</p>
              </div>
            </div>
          }
        </Grid>
      </Grid>
      <Divider></Divider>
    </div>
  );
}

export default function EngineerUserListPage() {
  const classes = useStyles();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [engineerUsers, setEngineerUsers] = useState<EngineerUser[]>([]);
  const [githubURL, setGithubURL] = useState<string>("");

  function onChangeGithubURL(e: FormChangeEvent) {
    setGithubURL(e.target.value);
  }

  async function addEngineerUser() {
    if (githubURL.indexOf("https://github.com/") !== 0) {
      setErrorMessage("Invalid GitHub account url");
      return;
    }

    if (user === null) {
      return;
    }

    // https://github.com/tokoroten-lab
    const engineerUserLoginName = githubURL.split('/')[3];

    try {
      const token = await user.getIdToken();
      const engineerUser = await api.addEngineerToList(token, engineerUserLoginName);

      setEngineerUsers([engineerUser, ...engineerUsers]);
      setErrorMessage("");
    } catch(err) {
      console.error(err);
    }

    /*
    const engineerUserId = mock.getRandomInt(0, 1000);
    const engineerUser: EngineerUser = {
      id: engineerUserId,
      loginName: engineerUserLoginName,
      displayName: `${engineerUserLoginName}`,
      photoURL: "https://avatars3.githubusercontent.com/u/51188956?v=4",
    };
    */

  }

  useEffect(() => {
    const f = async () => {
      if (user === null) {
        return;
      }

      const token = await user.getIdToken()
      const engineerUsers: EngineerUser[] = await api.getEngineerList(token);
      console.log("engineerUsers", engineerUsers);
      setEngineerUsers(engineerUsers);
    };

    f();
  }, [user])

  return (
    <Container>
      <Grid container className={classes.formContainer}>
        <Grid item xs={10}>
          <span className={classes.errorMessage}>{errorMessage}</span>
          <TextField
            fullWidth
            label="GitHubアカウントURL"
            value={githubURL}
            onChange={onChangeGithubURL}
            error={errorMessage !== ""}
          >
          </TextField>
        </Grid>
        <Grid item xs={2} className={classes.addButtonContainer}>
          <Button
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => addEngineerUser()}
          >
            追加
          </Button>
        </Grid>
      </Grid>
      <div className="engineers">
        {
          engineerUsers.map((engineerUser) => (
            <EngineerUserCard
              key={engineerUser.id}
              engineerUser={engineerUser}
            />
          ))
        }
      </div>
    </Container>
  );
}