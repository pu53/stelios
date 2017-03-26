import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { NavLink } from './components/NavLink.jsx';
import { IndexLink } from 'react-router'
import { Button, Menu, Item, Grid, Segment } from 'semantic-ui-react'
import { SearchBar } from './components/SearchBar'
import { Login } from './components/Login'


export class App extends Component {
    constructor(props) {
      super();
      this.state = ({
        token: localStorage.getItem('stelios_token'),
        current_user: localStorage.getItem('stelios_current_user'),
        show_login: false,
        activeItem: 'home'
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
          current_user: "null",
          show_login: false
        });
        localStorage.setItem('stelios_token', "null");
        localStorage.setItem('stelios_current_user', "null")
      }
    }

    successLogin() {
      this.setState({
        token: localStorage.getItem('stelios_token'),
        current_user: localStorage.getItem('stelios_current_user'),
        show_login: false
      });
    }

    handleItemClick = (e, {name}) => {
      this.setState({
        activeItem: name
      })
    }

  render() {
    var login_text = this.state.token === "null" ? "login" : "logout"
    return (
      <div className="App" style={{width:'100%'}}>
        <Segment raised style={{"color":"#212121"}}>
          <Menu pointing secondary>
            <Menu.Item name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick}><IndexLink to="/">Home</IndexLink></Menu.Item>
            <Menu.Item name="wiki" active={this.state.activeItem === 'wiki'} onClick={this.handleItemClick}><NavLink to="/wiki">Wiki</NavLink></Menu.Item>
            <Menu.Item name="quiz" active={this.state.activeItem === 'quiz'} onClick={this.handleItemClick}><NavLink to="/quiz">Quiz</NavLink></Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item onClick={() => this.handleLogin(login_text)}>{login_text}</Menu.Item>
            </Menu.Menu>
          </Menu>
        </Segment>
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
                <SearchBar type="semantic"/>
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
