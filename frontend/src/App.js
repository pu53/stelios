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
			activeItem: (window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home")
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

	componentWillMount() {
		this.setState({activeItem:(window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home")})
	}

	componentWillUpdate() {
		if(window.location.href.split("/")[3] === "") {
			console.log("Start updating, going to home page from" + this.state.activeItem)
			if(this.state.activeItem !== "home") {
				this.setState({activeItem:"home"})
			}
			console.log("Stop updating")
		}

		else if(this.state.activeItem !== window.location.href.split("/")[3])
		{
			console.log("Start updating, going to " + window.location.href.split("/")[3] + " the current state is " + this.state.activeItem)
			this.setState({activeItem:(window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home")})
			console.log("Stop updating")
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
            <IndexLink to="/"><Image inverted style={{"marginLeft":"20px", "marginTop":"23px", "marginRight":"20px"}} src={"https://stelios.no/logo.png"} width="50px" height="50px" shape="circular" /></IndexLink>
            <h1><IndexLink to="/" style={{"color":"#FFFFFF"}}>Stelios</IndexLink></h1>
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
                <Grid.Column width={16}>
                    <Segment raised style={{"justify-content":"center","marginTop":"-20px", "marginLeft":"-70px", "marginRight":"-70px"}}>
                        <Login show={this.state.show_login} success={() => this.successLogin()} />
                    </Segment>
                </Grid.Column>
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

export default App;
