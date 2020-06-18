import React, { Component } from 'react';

import Closed from '../containers/closed';
import Open from '../containers/open';

class Ticker extends Component {
  constructor(props) {
    super(props);

    this.symbol = props.match.params.symbol;
  }

  render() {
    return (
      <div className="page-main-div">
        <header>
          <p className="ticker-title">{this.symbol}</p>
          <Closed ticker={this.symbol}/>
          <Open ticker={this.symbol}/>
        </header>
      </div>
    );
  }
}

export default Ticker;
