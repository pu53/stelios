import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { NavLink } from './components/NavLink.jsx';
import { IndexLink } from 'react-router'
import { Button, Menu, Item, Grid, Segment, Image } from 'semantic-ui-react'
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
    var login_text = this.state.token === "null" || this.state.token === null ? "login" : "logout"
    return (
      <div className="App" style={{width:'100%'}}>
        <Segment raised style={{"color":"#FFFFFF","background-color":"#3F51B5","padding":"0 0 0 0"}}>
          <div style={{"display":"flex", "align-items":"center","margin-top":"px", "margin-bottom":"25px"}}>
            <Image inverted style={{"margin-left":"20px", "margin-top":"23px", "margin-right":"20px"}} src="www.stelios.no/logo.png" width="50px" height="50px" shape="circular"/>
            <h1>Stelios</h1>
          </div>
          <div style={{"width":"100%", "background-color": "#303F9F"}}>
            <Menu pointing secondary style={{"padding":"10px 0px 10px 30px"}}>
              <IndexLink to="/"><Menu.Item name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Home</Menu.Item></IndexLink>
              <NavLink to="/wiki" ><Menu.Item name="wiki" active={this.state.activeItem === 'wiki'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Wiki</Menu.Item></NavLink>
              <NavLink to="/quiz" ><Menu.Item name="quiz" active={this.state.activeItem === 'quiz'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Quiz</Menu.Item></NavLink>
              <Menu.Menu position='right'>
                <Menu.Item onClick={() => this.handleLogin(login_text)} style={{"color":"#FFFFFF"}}>{login_text[0].toUpperCase() + login_text.slice(1)}</Menu.Item>
              </Menu.Menu>
            </Menu>
          </div>
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
          {React.cloneElement(this.props.children, { steliosToken: this.state.token, steliosUser: this.state.current_user })}
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
