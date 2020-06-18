import React, { Component } from 'react';
import Axios from 'axios';

class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
  }

  handleChange(e) {
    let value = e.target.value;
    this.setState(
      prevState => ({
        ...prevState,
        password: value
      })
    );
  }

  handleKeypress(event) {
		if (event.key === "Enter") {
      Axios.post('https://yagrawlserver.herokuapp.com/api/options/password', { password: this.state.password })
      .then(res => {
        this.props.callback(res.status);
      }).catch(error => {
        this.props.callback(parseInt(error.message.split(" ").pop()));
      });
    }
  }

  render() {
    return(
      <div className="center">
        <input className="password-box"
               placeholder="password ..."
               autoComplete="off"
               onChange={this.handleChange}
               onKeyPress={this.handleKeypress}
               type="password"
               value={this.state.password}>
        </input>
      </div>
    )
  }
}

export default Password;
