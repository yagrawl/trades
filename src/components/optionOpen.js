import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import CustomizedSlider from './range';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

class OptionOpen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potential: 0
    }
  }

  updatePotential = data => {
    let potential = parseInt((data * this.props.contracts * 100).toFixed(2)) - this.props.exposure;

    this.setState(
      prevState => ({
        ...prevState,
        potential: potential
      })
    );
  }

  updateCommit = data => {
    let potential = parseInt((data * this.props.contracts * 100).toFixed(2)) - this.props.exposure;
    this.props.callback(potential);
  }

  render() {
    return (
      <tr>
        <th><Link to={`/ticker/${this.props.ticker}`} className="link">{this.props.ticker}</Link></th>
        <th>{this.props.strike}</th>
        <th>
          {`${this.props.jump}% `}
          {(this.props.jump >= 0) ?
            <span className="loss"><FontAwesomeIcon icon={faCaretDown} /></span> :
            <span className="profit"><FontAwesomeIcon icon={faCaretUp} /></span> }
        </th>
        <th>{this.props.contracts}</th>
        <th>{this.props.buy_price}</th>
        <th>
          <div className={(this.props.timeline > 75) ? "halfway-timeline-alert" : ""}>
            <ProgressBar striped animated now={this.props.timeline}/>
          </div>
        </th>
        <th>
          <CustomizedSlider buy_price={this.props.buy_price} callback={this.updatePotential} commit={this.updateCommit} max={this.props.buy_price * 5}/>
        </th>
        <th><span className="ticker-open">{`$${this.props.exposure}`}</span></th>
        <th className="transparent">
          <span className={(this.state.potential === 0) ? 'ticker-open-stripes' : ((this.state.potential) > 0 ? 'ticker-color-profit-stripes' : 'ticker-color-loss-stripes')}>
            {(this.state.potential) >= 0 ? `$${this.state.potential}` : `-$${Math.abs(this.state.potential)}`}
          </span>
        </th>
      </tr>
    );
  }
}

export default OptionOpen;
