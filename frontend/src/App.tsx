import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import useUser from './hooks/useUser';
import { makeStyles } from '@material-ui/core/styles';
import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@material-ui/core';
import {
  Inbox as InboxIcon,
  Mail as MailIcon,
} from '@material-ui/icons';
import ListItemLink from './components/ListItemLink';
import EngineerUserAbilityPage from './pages/EngineerUserAbilityPage';
import RegisterHRUserPage from './pages/RegisterHRUserPage';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  }
}));

function App() {
  const classes = useStyles();
  const {user, logout} = useUser();

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <div className="App">
      <Router>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <List>
            { !user && (
              <>
                <ListItemLink
                  to="/register"
                  primary="新規登録"
                />
                <ListItemLink
                  to="/login"
                  primary="ログイン"
                />
              </>
            )}
            { user && (
              <ListItem
                button
                key={"logout"}
                onClick={async () => {
                  await logout()
                }}
              >
                <ListItemText primary={"ログアウト"} />
              </ListItem>
            )}
          </List>
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text} onClick={() => console.log("yeah")}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Drawer>
        <div className={classes.content}>
          <Switch>
            <Route path="/user/engineer/:engineerUserId">
              <EngineerUserAbilityPage />
            </Route>
            <Route path="/register">
              <RegisterHRUserPage />
            </Route>
            <Route path="/login">
              <p>Login</p>
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
