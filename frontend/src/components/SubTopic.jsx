import React from 'react'
var Markdown = require('react-remarkable');
import {Button, Input, Grid, Form} from 'semantic-ui-react'
var SimpleMDE = require('react-simplemde-editor');

export class SubTopic extends React.Component {
	constructor(props){
		super(props);
		this.state = ({
			content: this.props.subtopic["content"],
			name: this.props.subtopic["name"],
			description: this.props.subtopic["description"],
			edit: false
		});
		this.editClick = this.editClick.bind(this);
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
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ 'subtopics/' + this.props.subtopic["id"] + '/';
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+ 'subtopics/' + this.props.subtopic["id"] + '/';
		    // production code
		}


		var request = new Request(link, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
      body: JSON.stringify({
				username: "pekka",
				password: "supremeleaderpekka",
        id: this.props.subtopic["id"],
        name: this.state.name,
				description: this.state.description,
				content: this.state.content
      })
		});

		fetch(request).then((res) => {
      return res.json();
    })
    .then((res) => {
			console.log(res);
    }).catch((e) => {console.log(e)});
	}

	handleCancelClick() {
		this.setState({
			content: this.props.subtopic["content"],
			name: this.props.subtopic["name"],
			description: this.props.subtopic["description"],
			edit: false
		});
	}

	render(){
		console.log(this.state.content);
		if (this.state.edit === false) {
			return (
				<div>
					<h3>
						Subtopic: {this.state.name}
						<Button content="edit" onClick={() => this.editClick()} />
					</h3>
					<h4>{this.state.description}</h4>
					<br></br>
					<Markdown source={this.state.content} />
				</div>
			);
		} else {
			return (
					<Form>
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
									<Button positive fluid content="Save" onClick={(e) => this.handleSaveClick(e)} />
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
