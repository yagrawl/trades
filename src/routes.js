import React, { Component } from 'react';
import { BrowserRouter as Router,
         Switch,
         Route } from 'react-router-dom';

import App from './pages/app';
import History from './pages/history';
import Open from './pages/open';
import Closed from './pages/closed';
import Ticker from './pages/ticker';

import NavBar from './components/navbar';

class Routes extends Component {
  render() {
    return (
      <Router>
        <div className="wrapper">
          <NavBar/>
          <Switch>
            <Route exact path="/" component={App} />
            <Route exact path="/history" component={History} />
            <Route exact path="/open" component={Open} />
            <Route exact path="/closed" component={Closed} />
            <Route exact path="/ticker/:symbol" component={Ticker} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Routes;
