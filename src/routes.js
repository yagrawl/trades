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
import Password from './components/password';

class Routes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: false,
    };

    this.getRoutes = this.getRoutes.bind(this);
  }

  updateAuth = data => {
    if(data === 200) {
      this.setState(
        prevState => ({
          ...prevState,
          auth: true
        })
      );
    } else {
      this.setState(
        prevState => ({
          ...prevState,
          auth: false
        })
      );
    }
  }

  getRoutes() {
    if(this.state.auth) {
      return (
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
      );
    } else {
      return <Password callback={this.updateAuth}/>
    }
  }

  render() {
    return (
      <Router>
        {this.getRoutes()}
      </Router>
    );
  }
}

export default Routes;
