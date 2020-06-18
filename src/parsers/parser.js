import data from '../data/sample.json';
import _ from 'lodash';

class Parser {
  constructor(ticker) {
    this.ticker = ticker;
    this.data = data.filter(option => (ticker === undefined) ? option : (option.ticker === ticker));
    this.totalOpenExposure = 0;
    this.totalClosedExposure = 0;
    this.totalClosedReturns = 0;
    this.totalClosedNet = 0;
    this.totalClosedPotential = 0;
  }

  parse() {
    let optionsData = [];

    this.data.forEach(option => {
      let parsedData = _.cloneDeep(option);
      delete parsedData.events;

      let currentEvents = this.consolidateEvents(parsedData, option.events).consolidatedEvents;

      for(let i = 0; i < currentEvents.length; i++) {
        optionsData.push(currentEvents[i]);
      }

      return;
    });

    return optionsData;
  }

  parseOpen() {
    let optionsData = [];
    let exposure = 0;

    this.data.forEach(option => {
      let parsedData = _.cloneDeep(option);
      delete parsedData.events;

      let currentEvents = this.consolidateEvents(parsedData, option.events).openEvents;

      if(currentEvents.length !== 0) {
        optionsData.push(currentEvents[0]);
        exposure += currentEvents[0].exposure;
      }

      return;
    });

    this.totalOpenExposure = exposure;

    return optionsData;
  }

  parseClose() {
    let dict = {};
    let closedEvents = this.parse().filter(option => (option.action !== "BUY"));
    let exposure = 0;
    let returns = 0;
    let total_potential = 0;

    closedEvents.forEach(option => {
      let key = option.ticker + option.strike.toString() + option.type + option.expiry;
      let potential = this.getPotential(option);

      if(key in dict) {

        dict[key].exposure += option.exposure;
        dict[key].returns += option.returns;
        dict[key].potential = (potential === "*") ? "*" : dict[key].potential + potential;
        dict[key].net = dict[key].returns - dict[key].exposure;
        dict[key].percent = ((option.net / option.exposure) * 100).toPrecision(3);
      } else {
        dict[key] = {};
        dict[key].id = option.id;
        dict[key].ticker = option.ticker;
        dict[key].strike = option.strike;
        dict[key].exposure = option.exposure;
        dict[key].returns = option.returns;
        dict[key].jump = option.jump;
        dict[key].timeline = option.timeline;
        dict[key].potential = (potential === "*") ? 0 : potential;
        dict[key].net = option.net;
        dict[key].percent = ((option.net / option.exposure) * 100).toPrecision(3);
      }

      exposure += option.exposure;
      returns += option.returns;
      total_potential  += (potential === "*") ? 0 : potential;
    });

    let consolidatedData = [];
    Object.keys(dict).forEach(key => {
      consolidatedData.push(dict[key]);
    });

    this.totalClosedExposure = exposure;
    this.totalClosedReturns = returns;
    this.totalClosedNet = returns - exposure;
    this.totalClosedPotential = total_potential;

    return consolidatedData.sort((a, b) => (a.id > b.id) ? 1 : -1);
  }

  consolidateEvents(metadata, events) {
    let consolidatedEvents = [];
    let openEvents = [];
    let contracts = 0;
    let price = 0;
    let date = new Date("01/01/3000");

    for(let i = 0; i < events.length; i++) {
      let option = _.cloneDeep(metadata);
      let e = events[i];

      option.eventid = e.eventid;
      option.date = e.date;
      option.contracts = e.contracts;
      option.action = e.action;
      option.jump = this.getJump(option.strike, option.type, option.high, option.low);

      if(option.action === "BUY") {
        option.price = e.price;
        option.exposure = this.getPrice(option.contracts, option.price);
        option.timeline = this.getBuyTimeline(option.expiry, option.date);

        price = (((contracts * price) + (e.contracts * e.price))/(contracts + e.contracts)).toFixed(4);
        contracts += e.contracts;
        date = (date > new Date(option.date)) ? new Date(option.date) : date;
      } else {
        (option.action === "SELL") ? option.price = price : option.price = 0;
        option.exposure = this.getPrice(option.contracts, price);

        option.returns = this.getPrice(option.contracts, e.price);
        option.net = option.returns - option.exposure;
        option.potential = this.getPotential(option);
        option.timeline = this.getSellTimeline(option.expiry, date, option.date);

        contracts -= e.contracts;
      }

      if(contracts > 0 && i === (events.length - 1)) {
        let openOption = _.cloneDeep(metadata);
        openOption.jump = option.jump;
        openOption.contracts = contracts;
        openOption.price = price;
        openOption.expiry = option.expiry;
        openOption.exposure = this.getPrice(contracts, price);
        openOption.timeline = this.getBuyTimeline(option.expiry, option.date);
        openEvents.push(openOption);
      }

      consolidatedEvents.push(option);
    }

    let parsedEvents = {}
    parsedEvents.consolidatedEvents = consolidatedEvents;
    parsedEvents.openEvents = openEvents;

    return parsedEvents;
  }

  getPrice(contracts, price) {
    return parseInt((contracts * price * 100).toFixed(2));
  }

  getSellTimeline(expiry, buyDate, sellDate) {
    const DAY = 24 * 60 * 60 * 1000;
    let expiryDay = new Date(expiry);
    let buyDay = new Date(buyDate);
    let sellDay = new Date(sellDate);

    let daysToExpiry = Math.round(Math.abs((expiryDay - buyDay) / DAY));
    let daysSoldAfter = Math.round(Math.abs((sellDay - buyDay) / DAY));

    return ((daysSoldAfter / daysToExpiry) * 100).toFixed(2);
  }

  getBuyTimeline(expiry, buyDate) {
    const DAY = 24 * 60 * 60 * 1000;
    let expiryDay = new Date(expiry);
    let buyDay = new Date(buyDate);
    let today = Date.now();

    let daysToExpiry = Math.round(Math.abs((expiryDay - buyDay) / DAY));
    let daysFromPurchase = Math.round(Math.abs((today - buyDay) / DAY));

    return (daysFromPurchase / daysToExpiry) * 100;
  }

  getJump(strike, type, high, low) {
    let jump = 0;
    let open = (high + low)/2;

    if(type === "PUT") {
      jump = Number.parseFloat(((open - strike)/open) * 100).toPrecision(3);
    } else {
      jump = Number.parseFloat(((strike - open)/open) * 100).toPrecision(3);
    }

    return jump;
  }

  getPotential(option) {
    if(option.date === option.expiry) {
      return 0;
    }

    let total_return;

    if(option.close !== "") {
      if(option.type === "PUT") {
        if(option.strike > option.close) {
          total_return = (option.strike - option.close) * 100;
        } else { total_return = 0; }
      } else {
        if(option.strike < option.close) {
          total_return = (option.close - option.strike) * 100;
        } else { total_return = 0; }
      }

      return parseInt((total_return - option.exposure - option.net).toFixed(2));
    } else { return "*"; }
  }
}

export { Parser };
