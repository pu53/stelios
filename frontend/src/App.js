import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { NavLink } from './components/NavLink.jsx';
import { IndexLink } from 'react-router'
import { Menu, Item, Grid } from 'semantic-ui-react'
import { SearchBar } from './components/SearchBar'
import { Login } from './components/Login'


export class App extends Component {
    constructor(props) {
      super();
      this.state = ({
        token: localStorage.getItem('stelios_token'),
        show_login: false
      })
    }

    handleLogin(e) {
      if (e === "login") {
        this.setState({
          show_login: !this.state.show_login
        });
      } else {
        this.setState({
          token: "null",
          show_login: false
        });
        localStorage.setItem('stelios_token', "null");
      }
    }

    successLogin() {
      this.setState({
        token: localStorage.getItem('stelios_token'),
        show_login: false
      });
    }

  render() {
    var login_text = this.state.token === "null" ? "login" : "logout"
    return (
      <div className="App" style={{width:'100%'}}>
        <div>
          <Menu>
            <Menu.Item><IndexLink to="/" activeStyle={{color:"red"}}>Home</IndexLink></Menu.Item>
            <Menu.Item><NavLink to="/wiki" activeStyle={{color:"red"}}>Wiki</NavLink></Menu.Item>
            <Menu.Item><NavLink to="/quiz" activeStyle={{color:"red"}}>Quiz</NavLink></Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                <div onClick={() => this.handleLogin(login_text)}>{login_text}</div>
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
        <div id="main_content">
          <Grid>
            {this.state.show_login ?
              <Grid.Row centered>
                <Login show={this.state.show_login} success={() => this.successLogin()} />
              </Grid.Row>
              :
              null
            }
            <Grid.Row>
              <Grid.Column width={16}>
                {/*<SearchBar type="semantic" template="subjects" />*/}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          {this.props.children}
        </div>
      </div>
    );
  }
}
/*
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
      link = 'http://localhost:8000/subjects/1'
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
}*/
export default App;
