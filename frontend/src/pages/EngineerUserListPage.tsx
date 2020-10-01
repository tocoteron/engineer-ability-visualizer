import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, FormControl, Grid, InputLabel, makeStyles, Select, TextField } from '@material-ui/core';
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
  },
  formControl: {
    marginBottom: theme.spacing(3),
  }
}));

function getEngineerAbilityReport(engineerUser: EngineerUser) {
  if (hasScore(engineerUser)) {
    const ability: EngineerUserAbilityReport = {
      id: 0,
      engineerUserId: engineerUser.id,
      projectScore: engineerUser.projectScore!,
      repositoryScore: engineerUser.repositoryScore!,
      commitScore: engineerUser.commitScore!,
      pullreqScore: engineerUser.pullreqScore!,
      issueScore: engineerUser.issueScore!,
      speedScore: engineerUser.speedScore!,
      createdAt: new Date(),
    };
    return ability;
  } else {
    const ability: EngineerUserAbilityReport = {
      id: 0,
      engineerUserId: engineerUser.id,
      projectScore: 0,
      repositoryScore: 0,
      commitScore: 0,
      pullreqScore: 0,
      issueScore: 0,
      speedScore: 0,
      createdAt: new Date(),
    };
    return ability;
  }
}

function EngineerUserCard(props: {engineerUser: EngineerUser}) {
  const classes = useStyles();
  const engineerUser = props.engineerUser;
  const ability = getEngineerAbilityReport(engineerUser);

  return (
    <div className="engineer">
      <Divider></Divider>
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
    </div>
  );
}

type FormChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

export default function EngineerUserListPage() {
  const classes = useStyles();
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [engineerUsers, setEngineerUsers] = useState<EngineerUser[]>([]);
  const [githubURL, setGithubURL] = useState<string>("");
  const [sortAxis, setSortAxis] = useState<string>("");

  function onChangeGithubURL(e: FormChangeEvent) {
    setGithubURL(e.target.value);
  }

  function compareByEngineerScore(a: EngineerUser, b: EngineerUser) {
    const aa = getEngineerAbilityReport(a);
    const ba = getEngineerAbilityReport(b);
    return calcEngineerScore(ba) - calcEngineerScore(aa);
  }

  function compareByDetectabilityScore(a: EngineerUser, b: EngineerUser) {
    const aa = getEngineerAbilityReport(a);
    const ba = getEngineerAbilityReport(b);
    return calcDetectabilityScore(ba) - calcDetectabilityScore(aa);
  }

  function compareBySolvingScore(a: EngineerUser, b: EngineerUser) {
    const aa = getEngineerAbilityReport(a);
    const ba = getEngineerAbilityReport(b);
    return calcSolvingScore(ba) - calcSolvingScore(aa);
  }

  function compareBySpeedScore(a: EngineerUser, b: EngineerUser) {
    const aa = getEngineerAbilityReport(a);
    const ba = getEngineerAbilityReport(b);
    return calcSpeedScore(ba) - calcSpeedScore(aa);
  }

  function onChangeSortAxis(e: React.ChangeEvent<{ value: unknown }>) {
    setSortAxis(e.target.value as string);

    const axis = Number(e.target.value);

    switch(axis) {
      case 1:
        setEngineerUsers(
          engineerUsers.slice().sort(compareByEngineerScore)
        );
        break;
      case 2:
        setEngineerUsers(
          engineerUsers.slice().sort(compareByDetectabilityScore)
        );
        break;
      case 3:
        setEngineerUsers(
          engineerUsers.slice().sort(compareBySolvingScore)
        );
        break;
      case 4:
        setEngineerUsers(
          engineerUsers.slice().sort(compareBySpeedScore)
        );
        break;
    }
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
      <FormControl variant="outlined" className={classes.formControl}> 
        <InputLabel htmlFor="outlined-age-native-simple">Sort</InputLabel>
        <Select
          native
          value={sortAxis}
          onChange={onChangeSortAxis}
          label="sort"
          inputProps={{
            name: 'sort',
            id: 'outlined-age-native-simple',
          }}
        >
          <option aria-label="None" value={0} />
          <option value={1}>エンジニアスコア</option>
          <option value={2}>発見力</option>
          <option value={3}>解決力</option>
          <option value={4}>スピード</option>
        </Select>
      </FormControl>
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