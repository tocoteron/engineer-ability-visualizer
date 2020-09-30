import React, { useState } from 'react';
import { Button, Container, Grid, makeStyles, TextField } from '@material-ui/core';
import mock from '../mock';
import EngineerUser from '../models/EngineerUser';
import { Link } from 'react-router-dom';


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
  }
}));

type FormChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;
type OnClickEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent>;

export default function EngineerUserListPage() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [engineerUsers, setEngineerUsers] = useState<EngineerUser[]>(mockEngineerUsers);
  const [githubURL, setGithubURL] = useState<string>("");

  function onChangeGithubURL(e: FormChangeEvent) {
    setGithubURL(e.target.value);
  }

  function addEngineerUser() {
    if (githubURL.indexOf("https://github.com/") !== 0) {
      setErrorMessage("Invalid GitHub account url");
      return;
    }

    // https://github.com/tokoroten-lab
    const engineerUserLoginName = githubURL.split('/')[3];
    const engineerUserId = mock.getRandomInt(0, 1000);

    const engineerUser: EngineerUser = {
      id: engineerUserId,
      loginName: engineerUserLoginName,
      displayName: `${engineerUserLoginName}`,
      photoURL: "https://avatars3.githubusercontent.com/u/51188956?v=4",
    };

    setEngineerUsers([engineerUser, ...engineerUsers]);
    setErrorMessage("");
  }

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
          engineerUsers.map((engineerUser) => {
            return (
              <div className="engineer">
                <Link to={`/engineers/${engineerUser.id}`}>
                  {engineerUser.displayName}さん
                </Link>
              </div>
            );
          })
        }
      </div>
    </Container>
  );
}