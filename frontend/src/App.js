import React from 'react';
import './App.css';
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import routes from "./routes";

import {
  isLoggedIn
} from './utils';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {routes.map((prop, key) => (
          <Route
            path={prop.path}
            component={prop.component}
            key={key}
          />
        ))}
        <Redirect from="/" to={isLoggedIn() ? "/home" : "/login"} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
