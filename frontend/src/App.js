import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { NavLink } from './components/NavLink.jsx';
import { IndexLink } from 'react-router'
import { Menu } from 'semantic-ui-react'
import { Item } from 'semantic-ui-react'

class App extends Component {
    constructor(props) {
      super();
    }

  render() {
    return (
      <div className="App">
        <div>
          <Menu>
            <Menu.Item><IndexLink to="/" activeStyle={{color:"red"}}>Home</IndexLink></Menu.Item>
          </Menu>
        </div>
        {this.props.children}
      </div>
    );
  }
}

class List extends Component {
  constructor(props) {
    super();
    this.state = {
      result: []
    };
    this.fetchData = this.fetchData.bind(this);
  }

  fetchData(event) {
    event.preventDefault();
    var link = '';
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      link = 'http://localhost:8000/users.json'
    // dev code
    } else {
      link = 'http://api.stelios.no/users.json'
    // production code
    }
    var request = new Request(link, {
      method: 'GET',
      headers: {
              'Accept': 'application/json',
          },
    });
    console.log("yes");
    fetch(request).then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      this.setState({ result: res });
    }).catch((e) => {console.log(e)});
  }

  render() {
    console.log(this.state.result)
    if (this.state.result.length > 0) {
      return (
        <div>
          <button onClick={this.fetchData}>kappa</button>
          <ul>
            { this.state.result.map(function(user){
                return(
                  <ul>
                    {Object.keys(user).map(function (key) {
                      return(
                        <li>{key}:  {user[key].toString()}</li>
                      )
                    })}
                    <br />
                  </ul>
                );
              })
            }
          </ul>
        </div>
      );
    } else {
      return(
        <div>
          <button onClick={this.fetchData}>kappa</button>
          <li>no data recived, click button ples</li>
        </div>

      );
    }
  }
}
export default App;
