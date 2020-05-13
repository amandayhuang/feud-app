import React from "react";
import { Switch, Route } from "react-router-dom";

import MainPage from "./main/main";

const App = () => (
  <Switch>
    <Route path="/" component={MainPage} />
  </Switch>
);

export default App;
