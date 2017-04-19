import React from 'react'
var Markdown = require('react-remarkable');
import {Button, Input, Grid, Form, Message} from 'semantic-ui-react'
var SimpleMDE = require('react-simplemde-editor');

export class SubTopic extends React.Component {
	displayName="SubTopic"
	constructor(props){
		super(props);
		this.state = ({
			content: this.props.subtopic["content"],
			name: this.props.subtopic["name"],
			description: this.props.subtopic["description"],
			edit: this.props.new,
			neg: true,
			message: "",
			loading: false
		});
		this.editClick = this.editClick.bind(this);
		console.log("constructor is called")
	}
	editClick() {
		this.setState({
			edit: !this.state.edit
		});
	}

	handleChange(e) {
		this.setState({
			content: e
		});
	}

	handleNameChange(e) {
		console.log(e.target.value);
		this.setState({
			name: e.target.value
		});
	}

	handleDescriptionChange(e) {
		this.setState({
			description: e.target.value
		});
	}

	handleSaveClick(e) {
		e.preventDefault();
		this.setState({
			loading: true
		});

		var token = localStorage.getItem('stelios_token');
		if (token === "null") {
			this.setState({
				message: "You need to login first",
				neg: true,
				loading: false
			});
			setTimeout(() => {
			  this.setState({ message: "" });
			}, 10000);
			return
		}
		var url = '';
		if (!this.props.new) {
			url = this.props.subtopic["id"] + '/'
		}
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ 'subtopics/' + url;
    		// dev code
    } else {
    		link = 'http://stelios.no/api/'+ 'subtopics/' +url;
		    // production code
		}

		var method_ = 'PUT';
		if (this.props.new) {
			method_ = 'POST'
		}
		var request = new Request(link, {
			method: method_,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + token
			},
      body: JSON.stringify({
        name: this.state.name,
				description: this.state.description,
				content: this.state.content,
				topics: [this.props.topicId]
      })
		});

		fetch(request).then((res) => {
			console.log(res.status)
			if (res.status === 200 || res.status === 201) {
				this.setState({
					message: this.props.new ? "Subtopic created" : "Subtopic updated",
					neg: false,
					edit: false
				});
				setTimeout(() => {
				  this.setState({ message: "" });
				}, 10000);
			} else if (res.status === 403) {
				this.setState({
					message: "You dont have access to edit/create this subtopic",
					neg: true,
					edit: false
				});
				setTimeout(() => {
				  this.setState({ message: "" });
				}, 10000);
			}
      return res.json();
    })
    .then((res) => {
			console.log(res);
			this.setState({
				loading: false
			});
    }).catch((e) => {
			console.log(e);
			this.setState({
				loading: false
			});
		});
	}

	handleCancelClick() {
		this.setState({
			content: this.props.subtopic["content"],
			name: this.props.subtopic["name"],
			description: this.props.subtopic["description"],
			edit: false
		});
	}

	message() {
		return(
			<Message positive={!this.state.neg} negative={this.state.neg} hidden={this.state.message === ""}>
				<Message.Header>{this.state.message}</Message.Header>
			</Message>
		);
	}

	render(){
		console.log(this.state.loading);
		if (this.state.edit === false) {
			return (
				<div>
					{this.message()}
					<Grid>
						<Grid.Column width={12}>
							<h3>Subtopic: {this.state.name}</h3>
						</Grid.Column>
						<Grid.Column width={4}>
							<Button basic content="edit" onClick={() => this.editClick()} />
						</Grid.Column>
					</Grid>
					<p><b>{this.state.description}</b></p>
					<br></br>
					<Markdown source={this.state.content} />
					<br />
					<br />
				</div>
			);
		} else {
			return (
					<Form>
						<h2>{this.props.new ? "New subtopic: " : ""}</h2>
						{this.message()}
						<Form.Field>
							<label>Subtopic name:</label>
							<Input fluid focus value={this.state.name} onChange={(e) => this.handleNameChange(e)} />
						</Form.Field>
						<Form.Field>
							<label>Description:</label>
							<Input fluid focus value={this.state.description} onChange={(e) => this.handleDescriptionChange(e)} />
						</Form.Field>
						<Form.Field>
							<label>Content:</label>
							<SimpleMDE
							  onChange={(e) => this.handleChange(e)}
							  value={this.state.content}
							  options={{
							    autofocus: true,
							    spellChecker: false,
							  }}
							/>
						</Form.Field>
						<Grid>
							<Grid.Row>
								<Grid.Column width={8}>
									<Button positive fluid loading={this.state.loading} content="Save" onClick={(e) => this.handleSaveClick(e)} />
								</Grid.Column>
								<Grid.Column width={8}>
									<Button negative fluid content="Cancel" onClick={() => this.handleCancelClick()} />
								</Grid.Column>
							</Grid.Row>
						</Grid>
						<br/>
						<br/>
					</Form>
				);
			}
		}
}
