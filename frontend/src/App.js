import React, { Component } from 'react';
import './App.css';
import { NavLink } from './components/NavLink.jsx';
import { IndexLink } from 'react-router'
import { Menu, Dropdown, Icon, Grid, Segment, Image } from 'semantic-ui-react'
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
        <Segment raised style={{"color":"#FFFFFF","backgroundColor":"#3F51B5","padding":"0 0 0 0"}}>
          <div style={{"display":"flex", "alignItems":"center","marginTop":"px", "marginBottom":"25px"}}>
            <Image style={{"marginLeft":"20px", "marginTop":"23px", "marginRight":"20px"}} src={process.env.PUBLIC_URL + "logo.png"} width="50px" height="50px" shape="circular"/>
            <h1>Stelios</h1>
          </div>
          <div style={{"width":"100%", "backgroundColor": "#303F9F"}}>
            <Menu pointing secondary style={{"padding":"10px 0px 10px 30px"}}>
              <IndexLink to="/"><Menu.Item name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Home</Menu.Item></IndexLink>
              <NavLink to="/wiki" ><Menu.Item name="wiki" active={this.state.activeItem === 'wiki'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Wiki</Menu.Item></NavLink>
              <NavLink to="/quiz" ><Menu.Item name="quiz" active={this.state.activeItem === 'quiz'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Quiz</Menu.Item></NavLink>
              <Menu.Menu position='right'>
                {this.state.token === "null" ?
                <Menu.Item onClick={() => this.handleLogin(login_text)} style={{"color":"#FFFFFF"}}>{login_text[0].toUpperCase() + login_text.slice(1)}</Menu.Item>
                :
                <Dropdown item text="User" style={{"color":"#FFFFFF"}}>
                    <Dropdown.Menu>
                        <Dropdown.Item><NavLink to="/user" ><Menu.Item name="user" active={this.state.activeItem === 'wiki'} onClick={this.handleItemClick}  ><Icon name='user' />Profile</Menu.Item></NavLink></Dropdown.Item>
                        <NavLink to="/" ><Dropdown.Item><Menu.Item onClick={() => this.handleLogin(login_text)}><Icon name='log out' />{login_text[0].toUpperCase() + login_text.slice(1)}</Menu.Item></Dropdown.Item></NavLink>
                    </Dropdown.Menu>
                </Dropdown>
                }
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
