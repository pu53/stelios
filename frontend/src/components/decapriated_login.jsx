import React from 'react'
import { SubTopic } from './SubTopic'
import { Message, Loader, Button, Header, Modal, Form, Grid, Input} from 'semantic-ui-react'

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
			this.setState({
        token: res.token,
				loading: false
      })
      localStorage.setItem('stelios_token', res.token);
			throw Error
    }).catch((e) => {
      console.log(e);
			if (e instanceof TypeError) {
				this.setState({
					login_error_message: "Couldnt connect to api.stelios.no",
					loading: false
	      });
			} else {
				this.setState({
					login_error_message: "Wrong username or password",
					loading: false
				});
			}
    });

  }

  handleLogout() {
    this.setState({
      token: "null"
    });
    localStorage.setItem('stelios_token', "null");
  }

	render(){
    var disable_button = false;
    if(this.state.username === "" || this.state.password === "") {
      disable_button = true
    }
    if (this.state.token === "null") {
      return (
        <Modal trigger={<div>Login</div>}>
          <Header content='Login or signup' />
          <Modal.Content>
            <Grid centered>
              <Grid.Row centered>
                <Grid.Column width={14}>
				          <Message negative hidden={this.state.login_error_message === ""}>
				            <Message.Header>{this.state.login_error_message}</Message.Header>
				          </Message>
                  <Form>
                    <Form.Field>
                      <label>Username</label>
                      <Input onChange={(e) => this.handleUsername(e)} />
                    </Form.Field>
                    <Form.Field>
                      <label>Password</label>
                      <Input type="password" onChange={(e) => this.handlePassword(e)} />
                    </Form.Field>
                    <Button disabled={disable_button} positive fluid loading={this.state.loading} onClick={(e) => this.handleLogin(e)}>Login</Button>
                    <br></br>
                  </Form>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      );
    } else {
      return(
        <div onClick={() => this.handleLogout()}>Logout</div>
      );
    }
	}
}
