import React from 'react';
import NotFoundPage from './components/notFoundPage';
import CameraComponent from './components/camera';
import Instructions from './components/Instructions';

import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";

function App() {
  return (

    <BrowserRouter>
      <div id="backsplash-wrapper">
        <div id="backsplash">
          <div>
            <img id="logo" src="/img/talentpath.png" alt="Talent Path Logo"/>
            <h1 id="headshot-title">HEADSHOTS</h1>
          </div>
        </div>
      </div>
      <Switch>
        <Route path="/" exact component={CameraComponent} />
        <Route path="/*" component={NotFoundPage} />
      </Switch>
      <Instructions />
    </BrowserRouter>
  );
}
export default App;
