import React from "react";
import { Switch, Route } from "react-router-dom";

import MainPage from "./main/main";
import Footer from "./footer/footer";

const App = () => (
  <>
    <Switch>
      <Route path="/" component={MainPage} />
    </Switch>
    <Footer />
  </>
);

export default App;
