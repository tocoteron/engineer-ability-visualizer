import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import EngineerUserAbilityPage from './pages/EngineerUserAbilityPage';

function App() {
  return (
    <div className="App">
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
