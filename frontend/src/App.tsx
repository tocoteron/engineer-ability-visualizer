import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
  RouteComponentProps
} from "react-router-dom";
import useUser from './hooks/useUser';
import { makeStyles } from '@material-ui/core/styles';
import {
  Divider,
  Drawer,
  List,
} from '@material-ui/core';
import {
  PersonAdd as PersonAddIcon,
  VpnKey as VpnKeyIcon,
  People as PeopleIcon,
} from '@material-ui/icons';
import ListItemLink from './components/ListItemLink';
import EngineerUserPage from './pages/EngineerUserPage';
import RegisterHRUserPage from './pages/RegisterHRUserPage';
import LoginHRUserPage from './pages/LoginHRUserPage';
import EngineerUserListPage from './pages/EngineerUserListPage';
import LogoutListItem from './components/LogoutListItem';

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
    marginTop: theme.spacing(3),
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
            { user && <LogoutListItem />}
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
            <Route exact path="/engineers">
              <EngineerUserListPage />
            </Route>
            <Route exact path="/engineers/:engineerUserId">
              <EngineerUserPage />
            </Route>
            <Route exact path="/register">
              <RegisterHRUserPage successCallbackPath="/engineers" />
            </Route>
            <Route exact path="/login">
              <LoginHRUserPage successCallbackPath="/engineers" />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
