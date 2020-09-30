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
  PersonAdd as PersonAddIcon,
  VpnKey as VpnKeyIcon,
  ExitToApp as ExitToAppIcon,
  People as PeopleIcon,
} from '@material-ui/icons';
import ListItemLink from './components/ListItemLink';
import EngineerUserAbilityPage from './pages/EngineerUserAbilityPage';
import RegisterHRUserPage from './pages/RegisterHRUserPage';
import LoginHRUserPage from './pages/LoginHRUserPage';

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
                  icon={<PersonAddIcon />}
                />
                <ListItemLink
                  to="/login"
                  primary="ログイン"
                  icon={<VpnKeyIcon />}
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
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary={"ログアウト"} />
              </ListItem>
            )}
          </List>
          <Divider />
          { user && (
            <>
              <List>
                <ListItemLink
                  to="/engineers"
                  primary="エンジニアリスト"
                  icon={<PeopleIcon />}
                />
              </List>
              <Divider />
            </>
          )}
        </Drawer>
        <div className={classes.content}>
          <Switch>
            <Route path="/engineers/:engineerUserId">
              <EngineerUserAbilityPage />
            </Route>
            <Route path="/register">
              <RegisterHRUserPage successCallbackPath="/" />
            </Route>
            <Route path="/login">
              <LoginHRUserPage successCallbackPath="/" />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
