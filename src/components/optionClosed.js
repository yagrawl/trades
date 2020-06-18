import React from 'react';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

const OptionClosed = (props) => (
  <tr>
    <th><Link to={`/ticker/${props.ticker}`} className="link">{props.ticker}</Link></th>
    <th>{props.strike}</th>
    <th>
      {`${props.jump}% `}
      {(props.jump >= 0) ?
        <span className="loss"><FontAwesomeIcon icon={faCaretDown} /></span> :
        <span className="profit"><FontAwesomeIcon icon={faCaretUp} /></span> }
    </th>
    <th><ProgressBar striped animated now={props.timeline}/></th>
    <th>{props.exposure}</th>
    <th>{props.returns}</th>
    <th>
      <span className={(props.profit) ? 'ticker-color-profit' : 'ticker-color-loss'}>
      {(props.percentview) ?
        `${props.percent}%` : props.net}
      </span>
    </th>
    <th className="transparent">
      <span className={(props.potential === "*" || props.potential === 0) ? 'ticker-open-stripes' : ((props.potential) > 0 ? 'ticker-color-profit-stripes' : 'ticker-color-loss-stripes')}>
        {(props.potential === "*") ? "···" : ((props.potential) >= 0 ? `$${props.potential}` : `-$${Math.abs(props.potential)}`)}
      </span>
    </th>
  </tr>
);

export default OptionClosed;
