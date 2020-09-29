import React, { useState } from 'react';
import Container from '@material-ui/core/Container';
import { TextField, Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import useUser from '../hooks/useUser';

interface FormState {
  email: string;
  password: string;
}

type FormChangeEvent = React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    errorMessage: {
      color: "#f00",
    },
    registerButton: {
      width: "100%",
      marginTop: 16,
    },
  }),
);

export default function RegisterHRUserPage() {
  const classes = useStyles();
  const { create } = useUser();
  const [errorMessage, setError] = useState<string>("");
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });

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

  async function registerHRUser() {
    try {
      await create(form.email, form.password);
    } catch(err) {
      setError(err.message)
    }
  }

  return (
    <Container fixed>
      <h1>新規登録</h1>
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
        className={classes.registerButton}
        color="primary"
        variant="contained"
        disableElevation
        onClick={registerHRUser}
      >
        登録
      </Button>
    </Container>
  );
}