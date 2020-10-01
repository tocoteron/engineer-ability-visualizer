import React, { useEffect, useState } from 'react';
import { Button, Container, Divider, FormControl, Grid, InputLabel, makeStyles, Select, TextField } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import SearchIcon from '@material-ui/icons/Search';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import SpeedIcon from '@material-ui/icons/Speed';
import EngineerUser, { hasScore } from '../models/EngineerUser';
import EngineerUserAbilityReport, {
  calcEngineerScore,
  calcDetectabilityScore,
  calcSolvingScore,
  calcSpeedScore,
  getEngineerAbilityReport,
  compareByEngineerScore,
  compareByDetectabilityScore,
  compareBySolvingScore,
  compareBySpeedScore, getRankByEngineerScore, getRankByDetectablityScore, getRankBySolvingScore, getRankBySpeedScore
} from '../models/EngineerUserAbilityReport';
import { Link } from 'react-router-dom';
import useUser from '../hooks/useUser';
import api from '../api';

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

function EngineerUserCard(props: {engineerUsers: EngineerUser[], engineerUser: EngineerUser}) {
  const classes = useStyles();
  const engineerUsers = props.engineerUsers;
  const engineerUser = props.engineerUser;
  const ability = getEngineerAbilityReport(engineerUser);
  const rank = {
    engineer: getRankByEngineerScore(engineerUsers, engineerUser),
    detectability: getRankByDetectablityScore(engineerUsers, engineerUser),
    solving: getRankBySolvingScore(engineerUsers, engineerUser),
    speed: getRankBySpeedScore(engineerUsers, engineerUser),
  };

  function getEngineerUserLink() {
    const link = `/engineers/${engineerUser.id}?`
      + `engineerRank=${rank.engineer}`
      + `&detectabilityRank=${rank.detectability}`
      + `&solvingRank=${rank.solving}`
      + `&speedRank=${rank.speed}`;

    return link;
  }

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
              <Link to={getEngineerUserLink()}>
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
                <p>{calcEngineerScore(ability)} ({rank.engineer}位)</p>
              </div>
              <div className={classes.score}>
                <SearchIcon></SearchIcon>
                <p>{calcDetectabilityScore(ability)} ({rank.detectability}位)</p>
              </div>
              <div className={classes.score}>
                <DoneOutlineIcon></DoneOutlineIcon>
                <p>{calcSolvingScore(ability)} ({rank.solving}位)</p>
              </div>
              <div className={classes.score}>
                <SpeedIcon></SpeedIcon>
                <p>{calcSpeedScore(ability)} ({rank.speed}位)</p>
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
              engineerUsers={engineerUsers}
              engineerUser={engineerUser}
            />
          ))
        }
      </div>
    </Container>
  );
}