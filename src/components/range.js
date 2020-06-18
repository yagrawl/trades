import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

const PrettoSlider = withStyles({
  root: {
    color: '#464857',
    height: 4,
  },
  thumb: {
    height: 12,
    width: 12,
    backgroundColor: '#393B43',
    border: '2px solid currentColor',
    marginTop: -4,
    marginLeft: -6,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 4,
    borderRadius: 2,
  },
  rail: {
    height: 4,
    borderRadius: 2,
  },
})(Slider);

class CustomizedSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potential: 0
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleCommit = this.handleCommit.bind(this);
  }

  handleChange(event, value) {
    this.props.callback(value);
  }

  handleCommit(event, value) {
    this.props.commit(value);
  }

  render() {
    return (
      <div>
        <PrettoSlider valueLabelDisplay="auto"
                      aria-label="pretto slider"
                      defaultValue={this.props.buy_price}
                      min={0}
                      max={this.props.max}
                      step={0.01}
                      onChange={this.handleChange}
                      onChangeCommitted={this.handleCommit}
                      />
      </div>
    );
  }
}

export default CustomizedSlider;
