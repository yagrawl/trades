import React, { Component } from 'react';

import { Parser } from '../parsers/parser';
import OptionOpen from '../components/optionOpen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDown } from '@fortawesome/free-solid-svg-icons';

class Open extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      ticker: props.ticker,
      total_potential: 0,
      total_exposure: 0
    }

    this.optionsData = new Parser(this.state.ticker);
    this.tickerSort = this.tickerSort.bind(this);
    this.differenceSort = this.differenceSort.bind(this);
    this.timelineSort = this.timelineSort.bind(this);
    this.exposureSort = this.exposureSort.bind(this);
    this.returnsSort = this.returnsSort.bind(this);
    this.netSort = this.netSort.bind(this);
  }

  componentDidMount() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.optionsData.parseOpen(),
        total_exposure: this.optionsData.totalOpenExposure
      })
    );
  }

  totalPotential = data => {
    console.log('here: ', data);
    this.setState(
      prevState => ({
        ...prevState,
        total_potential: this.state.total_potential + data
      })
    );
  }

  drawTables() {
    let options = this.state.data.map(option => {
      return <OptionOpen id={option.id}
                         ticker={option.ticker}
                         strike={option.strike}
                         jump={option.jump}
                         contracts={option.contracts}
                         buy_price={option.price}
                         timeline={option.timeline}
                         exposure={option.exposure}
                         callback={this.totalPotential}  />
    });

    return options;
  }

  tickerSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => (a.ticker > b.ticker) ? 1 : -1)
      })
    );
  }

  differenceSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => parseInt(a.jump) > parseInt(b.jump) ? 1 : -1)
      })
    );
  }

  timelineSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => parseInt(a.timeline) > parseInt(b.timeline) ? 1 : -1)
      })
    );
  }

  exposureSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => (a.exposure > b.exposure) ? 1 : -1)
      })
    );
  }

  returnsSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => (a.returns > b.returns) ? 1 : -1)
      })
    );
  }

  netSort() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.state.data.sort((a, b) => (a.net > b.net) ? 1 : -1)
      })
    );
  }

  render() {
    if(this.state.data.length) {
      return (
        <div>
          <p className="title">
            Open Options
            <div className="totals">
              {`Potential `}<span className={(this.state.total_potential < 0) ? "loss" : "profit"}>{(this.state.total_potential < 0) ? `-$` : `$`}{Math.abs(this.state.total_potential)}</span>
              {` · Exposure `}<span className="neutral">{`$${this.state.total_exposure}`}</span>
            </div>
          </p>
          <div className="page-main-div">
            <table>
              <td>Ticker
                <span className="sort" onClick={this.tickerSort}>
                  <FontAwesomeIcon icon={faSortAmountDown}/>
                </span>
              </td>
              <td>Strike</td>
              <td>Diff
                <span className="sort" onClick={this.differenceSort}>
                  <FontAwesomeIcon icon={faSortAmountDown}/>
                </span>
              </td>
              <td>Contracts</td>
              <td>Buy Price</td>
              <td>Timeline
                <span className="sort" onClick={this.timelineSort}>
                  <FontAwesomeIcon icon={faSortAmountDown}/>
                </span>
              </td>
              <td>Sell Price (est.)</td>
              <td>Exposure
                <span className="sort" onClick={this.exposureSort}>
                  <FontAwesomeIcon icon={faSortAmountDown} />
                </span>
              </td>
              <td>Potential</td>
              {this.drawTables()}
           </table>
          </div>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

export default Open;
