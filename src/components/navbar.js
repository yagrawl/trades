import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => (
  <div className="navbar">
    <Link to="/" className="link"><span className="navbar-title">Options</span></Link>
    <Link to="/open" className="link"><span className="navbar-sections">Open</span></Link>
    <Link to="/closed" className="link"><span className="navbar-sections">Closed</span></Link>
    <Link to="/history" className="link"><span className="navbar-sections">History</span></Link>
    <div className="clear"></div>
  </div>
);

export default NavBar;
