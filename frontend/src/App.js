import React, { Component } from 'react';
import './App.css';
import { IndexLink, Link } from 'react-router'
import { Menu, Dropdown, Icon, Grid, Segment, Image } from 'semantic-ui-react'
import { SearchBar } from './components/SearchBar'
import { Login } from './components/Login'
import { getData } from './helpers'


//this is the main component and is rendered on every page
export class App extends Component {
	constructor(props) {
		super();
		this.state = ({
			token: localStorage.getItem('stelios_token'),
			current_user: localStorage.getItem('stelios_current_user'),
			current_user_professor: localStorage.getItem('stelios_current_user_professor'),
			show_login: false,
			activeItem: (window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home"),
			name: 'user'
		})

		//We used to to set these items to the string "null", this is now changed to what it should be, the object null.
		//because prevoius browsers still have the string "null" change it to the object null, in other words remove the element
		if(localStorage.getItem('stelios_token') === "null") {
			localStorage.removeItem('stelios_token')
		}
		if(localStorage.getItem('stelios_current_user' === "null")){
			localStorage.removeItem('stelios_current_user')
		}
		if(localStorage.getItem('stelios_current_user_professor') === "null") {
			localStorage.removeItem('stelios_current_user_professor')
		}
	}

	handleLogin(e) {
		if (e === "login") {
			this.setState({
				show_login: !this.state.show_login
			});
		} else {
			this.setState({
				token: null,
				current_user: null,
				current_user_professor: null,
				show_login: false
			});
			localStorage.removeItem('stelios_token');
			localStorage.removeItem('stelios_current_user')
			localStorage.removeItem('stelios_current_user_professor')
		}
	}

	componentWillMount() {
		this.setState({activeItem:(window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home")})
		//get the name of the user:
		if(this.state.current_user !== null) {
			var url = "users/" + this.state.current_user + "/"
			var handleStatus = () => {}
			var handleData = (res) => {
				this.setState({
					name: res.username
				})
			}
			var handleError = () => {}
			getData(url, handleStatus, handleData, handleError)
		}
	}

	componentWillUpdate() {
		if(window.location.href.split("/")[3] === "") {
			if(this.state.activeItem !== "home") {
				this.setState({activeItem:"home"})
			}
		}

		else if(this.state.activeItem !== window.location.href.split("/")[3]){
			this.setState({activeItem:(window.location.href.split("/")[3] !== ""?window.location.href.split("/")[3]:"home")})
		}
	}
	successLogin() {
		this.setState({
			token: localStorage.getItem('stelios_token'),
			current_user: localStorage.getItem('stelios_current_user'),
			current_user_professor: localStorage.getItem('stelios_current_user_professor'),
			show_login: false
		});
		//get the name of the user:
		var url = "users/" + localStorage.getItem('stelios_current_user') + "/"
		var handleStatus = () => {}
		var handleData = (res) => {
			this.setState({
				name: res.username
			})
		}
		var handleError = () => {}
		getData(url, handleStatus, handleData, handleError)
	}

	handleItemClick = (e, {name}) => {
		//if you are in quiz, reload the site
		if(name === this.state.activeItem && name === "quiz") {
			window.location.reload()
		}
		this.setState({
			activeItem: name
		})
	}

	render() {
		var login_text = this.state.token === "null" || this.state.token === null ? "login" : "logout"
		return (
			<div className="App" style={{width:'100%'}}>
			<Segment raised style={{"color":"#FFFFFF","backgroundColor":"#3F51B5","padding":"0 0 0 0"}}>
				<div style={{"display":"flex", "alignItems":"center","marginTop":"px", "marginBottom":"25px"}}>
				<IndexLink to="/"><Image style={{"marginLeft":"20px", "marginTop":"23px", "marginRight":"20px"}} src={"https://stelios.no/logo.png"} width="50px" height="50px" shape="circular" /></IndexLink>
				<h1><IndexLink to="/" style={{"color":"#FFFFFF"}}>Stelios</IndexLink></h1>
				</div>
				<div style={{"width":"100%", "backgroundColor": "#303F9F"}}>

				{/* Navigation menu on top of web page */}
				<Menu pointing secondary style={{"padding":"10px 0px 10px 30px"}}>
				  <IndexLink to="/"><Menu.Item name="home" active={this.state.activeItem === 'home'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Home</Menu.Item></IndexLink>
				  <Link to="/wiki" ><Menu.Item name="wiki" active={this.state.activeItem === 'wiki'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Wiki</Menu.Item></Link>
				  <Link to="/quiz" ><Menu.Item name="quiz" active={this.state.activeItem === 'quiz'} onClick={this.handleItemClick} style={{"color":"#FFFFFF"}}>Quiz</Menu.Item></Link>

				  {/* Dropdown menu for accessing the profile page */}
				  <Menu.Menu position='right'>
					{this.state.token === null  ?
					<Menu.Item onClick={() => this.handleLogin(login_text)} style={{"color":"#FFFFFF"}}>{login_text[0].toUpperCase() + login_text.slice(1)}</Menu.Item>
					:
					<Dropdown item text={this.state.name} style={{"color":"#FFFFFF"}}>
						<Dropdown.Menu>
							<Dropdown.Item><Link to="/user" ><Menu.Item name="user" onClick={this.handleItemClick}  ><Icon name='user' />Profile</Menu.Item></Link></Dropdown.Item>
							<Link to="/" ><Dropdown.Item><Menu.Item onClick={() => this.handleLogin(login_text)}><Icon name='log out' />{login_text[0].toUpperCase() + login_text.slice(1)}</Menu.Item></Dropdown.Item></Link>
						</Dropdown.Menu>
					</Dropdown>
					}
				  </Menu.Menu>
				</Menu>
			  </div>
			</Segment>

			{/* main_content contains the objects shown between the header and footer */}
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
			  </Grid>
			  {React.cloneElement(this.props.children, { steliosToken: this.state.token, steliosUser: this.state.current_user, steliosUserProfessor: this.state.current_user_professor })}
			</div>
		  </div>
		);
	}
}

export default App;
