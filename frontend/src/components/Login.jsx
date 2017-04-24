import React from 'react'
import { Message, Button, Form, Grid, Segment, Input } from 'semantic-ui-react'
import { sendData } from '../helpers'

// Login is a component that contains both login and signup. Login lives in app.js
export class Login extends React.Component{
	constructor(props){
		super(props);
    this.state = ({
      token: localStorage.getItem('stelios_token'),
      username: "",
      password: "",
			retypePassword: "",
      message: "",
			loading: false,

			signup: false,
			firstName: '',
			lastName: '',
			email: '',
			passwordMatch: true,
			signupSuccess: false,
    });
	}

  handleUsername = (e,{value}) => {
    this.setState({
      username: value
    })
  }

  handlePassword = (e, {value}) => {
		if(this.state.password !== value){
			this.setState({
				password: value,
				passwordMatch: false
			})
		} else {
			this.setState({
				password: value,
				passwordMatch: true
			})
		}
  }

	handleRetypePassword = (e, {value}) =>{
		if(this.state.password !== value){
			this.setState({
				retypePassword: value,
				passwordMatch: false
			})
		} else {
			this.setState({
				retypePassword: value,
				passwordMatch: true
			})
		}
	}

  handleLogin = (e) => {
    e.preventDefault();
		this.setState({
			loading: true
		});
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/api/'+ 'api-token-auth/';
    		// dev code
    } else {
    		link = 'https://stelios.no/api/'+ 'api-token-auth/';
		    // production code
		}


		var request = new Request(link, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({
				username: this.state.username,
				password: this.state.password
      })
		});

		fetch(request).then((res) => {
      return res.json();
    })
    .then((res) => {
			if (res.non_field_errors !== undefined && res.non_field_errors[0] === "Unable to log in with provided credentials.") {
				this.setState({
					message: "Wrong username or password",
					loading: false
				});
			} else {
				this.setState({
	        token: res.token,
					message: "",
					loading: false
	      })
	      localStorage.setItem('stelios_token', res.token);
		  	localStorage.setItem('stelios_current_user', res.id);
				console.log(res);
				localStorage.setItem('stelios_current_user_professor', res.professor);
				this.props.success();
			}
    }).catch((e) => {
			console.log(e);
			if (e instanceof TypeError) {
				this.setState({
					message: "Couldnt connect to server",
					loading: false
	      });
			} else {
				this.setState({
					message: e,
					loading: false
				});
			}
    });

  }

	handleSignup = (e) => {
		e.preventDefault()
		this.setState({
			signup: true
		})
	}

	handleFirstName = (e, {value}) => {
		e.preventDefault()
		this.setState({
			firstName: value
		})
	}

	handleLastName = (e, {value}) => {
		e.preventDefault();
		this.setState({
			lastName: value
		})
	}

	handleEmail = (e, {value}) => {
		e.preventDefault()
		this.setState({
			email: value
		})
	}

	handleSignupSend = (e) => {
		e.preventDefault()
		var url = "signup/"
		var method = "POST"
		var body = {
			username: this.state.username,
			password: this.state.password,
			first_name: this.state.firstName,
			last_name: this.state.lastName,
			email: this.state.email
		}
		var handleStatus = (res) => {
			if (res.status >= 200 && res.status <= 204) {
				this.setState({
					signupSuccess: true
				})
			} else {
				this.setState({
					message: "User could not be created"
				})
			}
		}
		var handleData = (res) => {
			localStorage.setItem('stelios_token', res.token);
			localStorage.setItem('stelios_current_user', res.id);
			console.log("professor", res);
			localStorage.setItem('stelios_current_user_professor', res.professor)
			this.props.success();
		}
		var handleError = (err) => {
			this.setState({
				message: e
			})
		}
		// .call was used because "this" was not sent to function
		sendData.call(this,url, method, body, handleStatus, handleData, handleError)
	}

	handleCancel = (e) => {
		e.preventDefault()
		this.setState({
			firstName: '',
			lastName: '',
			email: '',
			signup: false,
			passwordMatch: true,
			retypePassword:'',
		})
	}

	render(){
    var disable_button = false;
		// check if login/signup button should be disabled
    if(this.state.username === "" || this.state.password === "" || (this.state.password !== "" && this.state.signup && this.state.password !== this.state.retypePassword)) {
      disable_button = true
    }
    if (this.props.show === true) {
			if (!this.state.signup) {
      	return (
					<div style={{"justify-content":"center"}}>
						<Grid>
							<Grid.Column width={4}></Grid.Column>
							<Grid.Column width={8}>
								<Message negative hidden={this.state.message === ""}>
									<Message.Header>{this.state.message}</Message.Header>
								</Message>
								<Grid>
									<Grid.Column width={16}>
										<Input fluid placeholder='Username' value={this.state.username} onChange={this.handleUsername} />
									</Grid.Column>
									<Grid.Column width={16} style={{"marginTop":"-20px"}}>
										<Input fluid type='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} />
									</Grid.Column>
									<Grid.Column width={16} style={{"marginTop":"-10px"}}>
										<Button fluid disabled={disable_button} positive fluid loading={this.state.loading} onClick={this.handleLogin}>Login</Button>
									</Grid.Column>
									<Grid.Column width={16} style={{"marginTop":"-20px"}}>
										<Button style={{"backgroundColor":"#03a9f4"}} fluid onClick={this.handleSignup}>Signup</Button>
									</Grid.Column>
								</Grid>
							</Grid.Column>
							<Grid.Column width={4}></Grid.Column>
						</Grid>
					</div>
				);
				}	else {
					return(
						<div style={{"justify-content":"center"}}>
							<Grid>
								<Grid.Column width={4}></Grid.Column>
								<Grid.Column width={8}>
									<Message negative hidden={this.state.message === ""}>
										<Message.Header>{this.state.message}</Message.Header>
									</Message>
									<Form>
										<Grid>
											<h3 style={{"paddingTop":"15px"}}>Signup to stelios</h3>
											<Form.Field width={16}>
												<label>Username:</label>
												<Form.Input fluid placeholder='Username' value={this.state.username} onChange={this.handleUsername} />
											</Form.Field>
											<Form.Field width={16}>
												<label>Password:</label>
												<Form.Input fluid type='password' placeholder='Password' value={this.state.password} onChange={this.handlePassword} />
											</Form.Field>
											<Form.Field width={16}>
												<label>Retype password:</label>
												<Form.Input error={!this.state.passwordMatch} fluid type='password' placeholder='Retype password' value={this.state.retypePassword} onChange={this.handleRetypePassword} />
											</Form.Field>
											<h4 style={{"marginTop":"-5px"}}>Optional:</h4>
											<Form.Field width={16} >
												<label>First name:</label>
												<Form.Input fluid placeholder='First name' value={this.state.firstName} onChange={this.handleFirstName} />
											</Form.Field>
											<Form.Field width={16} >
												<label>Last name:</label>
												<Form.Input fluid placeholder='Last name' value={this.state.lastName} onChange={this.handleLastName} />
											</Form.Field>
											<Form.Field width={16}>
												<label>Email:</label>
												<Form.Input fluid placeholder='Email' value={this.state.email} onChange={this.handleEmail} />
											</Form.Field>
											<Grid.Column width={16} style={{"marginTop":"-10px"}}>
												<Button fluid disabled={disable_button} positive fluid loading={this.state.loading} onClick={this.handleSignupSend}>Signup</Button>
											</Grid.Column>
											<Grid.Column width={16} style={{"marginTop":"-20px"}}>
												<Button negative fluid onClick={this.handleCancel}>Cancel</Button>
											</Grid.Column>
										</Grid>
									</Form>
								</Grid.Column>
								<Grid.Column width={4}></Grid.Column>
							</Grid>
						</div>
					)
				}
    } else {
      return(
        null
      );
    }
	}
}
