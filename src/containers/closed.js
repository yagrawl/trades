import React, { Component } from 'react';

import { Parser } from '../parsers/parser';
import OptionClosed from '../components/optionClosed';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAmountDown, faPercentage } from '@fortawesome/free-solid-svg-icons';

class Closed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      total_exposure: 0,
      total_returns: 0,
      total_net: 0,
      total_potential: 0,
      ticker: props.ticker,
      percent_net_view: false
    }

    this.optionsData = new Parser(this.state.ticker);
    this.tickerSort = this.tickerSort.bind(this);
    this.differenceSort = this.differenceSort.bind(this);
    this.timelineSort = this.timelineSort.bind(this);
    this.exposureSort = this.exposureSort.bind(this);
    this.returnsSort = this.returnsSort.bind(this);
    this.netSort = this.netSort.bind(this);
    this.handleNetViewChange = this.handleNetViewChange.bind(this);
  }

  componentDidMount() {
    this.setState(
      prevState => ({
        ...prevState,
        data: this.optionsData.parseClose(),
        total_exposure: this.optionsData.totalClosedExposure,
        total_returns: this.optionsData.totalClosedReturns,
        total_net: this.optionsData.totalClosedNet,
        total_potential: this.optionsData.totalClosedPotential
      })
    );
  }

  drawTables() {
    let options = this.state.data.map(option => {
      return <OptionClosed key={option.id}
                           ticker={option.ticker}
                           strike={`$${option.strike}`}
                           jump={option.jump}
                           timeline={parseInt(option.timeline)}
                           exposure={`$${option.exposure.toString()}`}
                           returns={`$${option.returns.toString()}`}
                           percent={option.percent}
                           net={(option.net < 0) ? `-$${Math.abs(option.net).toString()}` : `$${option.net.toString()}`}
                           profit={(option.net >= 0)}
                           percentview={this.state.percent_net_view}
                           potential={option.potential} />
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

    if(this.state.percent_net_view) {
      this.setState(
        prevState => ({
          ...prevState,
          data: this.state.data.sort((a, b) => parseInt(a.percent) > parseInt(b.percent) ? 1 : -1)
        })
      );
    } else {
      this.setState(
        prevState => ({
          ...prevState,
          data: this.state.data.sort((a, b) => (a.net > b.net) ? 1 : -1)
        })
      );
    }
  }

  handleNetViewChange() {
    this.setState(
      prevState => ({
        ...prevState,
        percent_net_view: !(this.state.percent_net_view)
      })
    );
  }

  render() {
    if(this.state.data.length) {
      return (
        <div>
          <p className="title">
            Closed Options
            <div className="totals">
              {`Exposure `}<span className="neutral">{`$${this.state.total_exposure}`}</span>
              {` · Returns `}<span className="neutral">{`$${this.state.total_returns}`}</span>
              {` · Net `}<span className={(this.state.total_net < 0) ? "loss" : "profit"}>{(this.state.total_net < 0) ? `-$` : `$`}{Math.abs(this.state.total_net)}</span>
              {` · Post Tax `}<span className={((this.state.total_net * 0.665) < 0) ? "loss" : "profit"}>{((this.state.total_net * 0.665) < 0) ? `-$` : `$`}{Math.abs((this.state.total_net * 0.665).toFixed(2))}</span>
              {` · Potential `}<span className={(this.state.total_potential < 0) ? "loss" : "profit"}>{(this.state.total_potential < 0) ? `-$` : `$`}{Math.abs(this.state.total_potential)}</span>
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
              <td>Timeline
                <span className="sort" onClick={this.timelineSort}>
                  <FontAwesomeIcon icon={faSortAmountDown}/>
                </span>
              </td>
              <td>Exposure
                <span className="sort" onClick={this.exposureSort}>
                  <FontAwesomeIcon icon={faSortAmountDown} />
                </span>
              </td>
              <td>Returns
                <span className="sort" onClick={this.returnsSort}>
                  <FontAwesomeIcon icon={faSortAmountDown} />
                </span>
              </td>
              <td>Net
                <span className="sort" onClick={this.netSort}>
                  <FontAwesomeIcon icon={faSortAmountDown} />
                </span>
                <span className="sort" onClick={this.handleNetViewChange}>
                  <FontAwesomeIcon icon={faPercentage} />
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

export default Closed;
