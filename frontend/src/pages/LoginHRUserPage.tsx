import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { TextField, Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import useUser from '../hooks/useUser';
import { RouteComponentProps, withRouter } from 'react-router';

interface Props extends RouteComponentProps<{}> {
  successCallbackPath: string;
}

interface FormState {
  email: string;
  password: string;
}

const initFormState: FormState = {
  email: "",
  password: "",
}

type FormChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorMessage: {
      color: "#f00",
    },
    loginButton: {
      width: "100%",
      marginTop: 16,
    },
  }),
);

function LoginHRUserPage(props: Props) {
  const classes = useStyles();
  const { login } = useUser();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [form, setForm] = useState<FormState>(initFormState);

  function onChangeEmail(e: FormChangeEvent) {
    setForm({
      ...form,
      email: e.target.value,
    });
  }

  function onChangePassword(e: FormChangeEvent) {
    setForm({
      ...form,
      password: e.target.value,
    });
  }

  async function loginHRUser() {
    try {
      await login(form.email, form.password);
      setErrorMessage("");
      setForm(initFormState);
      props.history.push(props.successCallbackPath);
    } catch(err) {
      setErrorMessage(err.message)
    }
  }

  return (
    <Container fixed>
      <h1>ログイン</h1>
      <span className={classes.errorMessage}>{errorMessage}</span>
      <TextField
        fullWidth
        required
        label="メールアドレス"
        type="email"
        onChange={onChangeEmail}
      />
      <TextField
        fullWidth
        required
        label="パスワード"
        type="password"
        value={form.password}
        onChange={onChangePassword}
      />
      <Button
        className={classes.loginButton}
        color="primary"
        variant="contained"
        disableElevation
        onClick={loginHRUser}
      >
        ログイン
      </Button>
    </Container>
  );
}

export default withRouter(LoginHRUserPage);