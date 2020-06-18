import React, { Component } from 'react';

import Closed from '../containers/closed';
import Open from '../containers/open';

class History extends Component {
  render() {
    return (
      <div className="page-main-div">
        <header>
          <Open/>
          <Closed/>
        </header>
      </div>
    );
  }
}

export default History;
