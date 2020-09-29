import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import useUser from './hooks/useUser';
import EngineerUserAbilityPage from './pages/EngineerUserAbilityPage';

function App() {
  const {user, create, login, logout} = useUser();

  return (
    <div className="App">
      { user !== null &&
        <div>
          <p>{user.email}</p>
          <button
            onClick={() => logout()}
          >
            ログアウト
          </button>
        </div>
      }
      <button
        onClick={async () => {
          await create("yeah@example.com", "password");
        }}
      >
        作成
      </button>
      <button
        onClick={async () => await login("yeah@example.com", "password")}
      >
        ログイン
      </button>
      <Router>
        <Switch>
          <Route path="/user/engineer/:engineerUserId">
            <EngineerUserAbilityPage />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
