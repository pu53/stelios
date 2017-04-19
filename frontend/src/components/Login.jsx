import React from 'react'
import { Message, Button, Form, Grid } from 'semantic-ui-react'

export class Login extends React.Component{
	constructor(props){
		super(props);
    this.state = ({
      token: localStorage.getItem('stelios_token'),
      username: "",
      password: "",
      login_error_message: "",
			loading: false
    });
	}

  handleUsername(e) {
    this.setState({
      username: e.target.value
    })
  }

  handlePassword(e) {
    this.setState({
      password: e.target.value
    })
  }

  handleLogin(e) {
    e.preventDefault();
		this.setState({
			loading: true
		});
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ 'api-token-auth/';
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+ 'api-token-auth/';
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
					login_error_message: "Wrong username or password",
					loading: false
				});
			} else {
				this.setState({
	        token: res.token,
					login_error_message: "",
					loading: false
	      })
	      localStorage.setItem('stelios_token', res.token);
		  localStorage.setItem('stelios_current_user', res.id);
				this.props.success();
			}
    }).catch((e) => {
			console.log(e);
			if (e instanceof TypeError) {
				this.setState({
					login_error_message: "Couldnt connect to server",
					loading: false
	      });
			} else {
				this.setState({
					login_error_message: e,
					loading: false
				});
			}
    });

  }

	render(){
    var disable_button = false;
    if(this.state.username === "" || this.state.password === "") {
      disable_button = true
    }
    if (this.props.show === true) {
      return (
				<div>
          	<Grid.Column width={16}>
				      <Message negative hidden={this.state.login_error_message === ""}>
				        <Message.Header>{this.state.login_error_message}</Message.Header>
				      </Message>
            	<Form>
              	<Form.Group>
									<Form.Input placeholder='Username' onChange={(e) => this.handleUsername(e)} />
									<Form.Input type='password' placeholder='Password' onChange={(e) => this.handlePassword(e)} />
              	</Form.Group>
								<Button disabled={disable_button} positive fluid loading={this.state.loading} onClick={(e) => this.handleLogin(e)}>Login</Button>
            	</Form>
          	</Grid.Column>
				</div>
      );
    } else {
      return(
        null
      );
    }
	}
}
