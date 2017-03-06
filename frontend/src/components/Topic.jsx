import React from 'react'
import { SubTopic } from './SubTopic'
import { Dimmer, Loader, Grid, Button, Divider, Message, Form, Input} from 'semantic-ui-react'
var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

export class Topic extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
			id: null,
			name: '',
			description: '',
			newSubtopic: false,
			edit: false,
			new: false,
			loading: false,
			message: '',
			neg: true,
			subjects: []
		})
	}

	componentDidUpdate() {
		if (this.props.topic !== undefined) {
			if (this.state.id !== this.props.topic.id) {
				this.setState({
					id: this.props.topic.id,
					name: this.props.topic.name,
					description: this.props.topic.description,
					subjects: this.props.topic.subjects
				})
			}
		}
	}

	topicShow() {
		return(
			<div>
				<Grid>
					<Grid.Column width={12}>
						<h2>Topic: {this.state.name}</h2>
					</Grid.Column>
					<Grid.Column width={4}>
						<Button.Group basic float="right">
							<Button content="Edit" onClick={() => {this.setState({edit: true})}}/>
							<Button content="New" onClick={() => {this.setState({new: true})}} />
						</Button.Group>
					</Grid.Column>
				</Grid>
				<br/>
				<p><b>{this.state.description}</b></p>
				<br/>
			</div>
		);
	}

	topicEdit() {
		return(
			<Form>
				<Grid>
					<Grid.Column width={12}>
						<h2>Edit topic:</h2>
					</Grid.Column>
					<Grid.Column width={4}>
						<Button.Group basic float="right">
							<Button content="New" onClick={() => {this.setState({new: true})}} />
						</Button.Group>
					</Grid.Column>
				</Grid>
				<Form.Field>
					<label>Topic name: </label>
					<Input fluid focus value={this.state.name} onChange={(e) => {this.setState({name: e.target.value})}} />
					</Form.Field>
				<Form.Field>
					<label>Description: </label>
					<Input fluid focus value={this.state.description} onChange={(e) => {this.setState({description: e.target.value})}} />
				</Form.Field>
				<Grid>
					<Grid.Row>
						<Grid.Column width={8}>
							<Button positive fluid loading={this.state.loading} content="Save" onClick={(e) => this.handleSaveClick(e)} />
						</Grid.Column>
						<br />
						<Grid.Column width={8}>
							<Button negative fluid content="Cancel" onClick={() => {this.setState({
									name: this.props.topic.name,
									description: this.props.topic.description,
									edit: false
								})}} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
				<br />
			</Form>
		);
	}

	handleSaveClick(e) {
		e.preventDefault()
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
			url = this.props.topic["id"] + '/'
		}
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ 'topics/' + url;
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+ 'topics/' +url;
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
				subjects: this.state.subjects.length < 1 ? this.props.subjectId : this.state.subjects
      })
		});

		fetch(request).then((res) => {
			if (res.status === 200 || res.status === 201) {
				this.setState({
					message: this.state.edit ? "topic updated" : "topic created",
					neg: false,
					edit: false
				});
				setTimeout(() => {
				  this.setState({ message: "" });
				}, 10000);
			} else if (res.status === 403) {
				this.setState({
					message: "You dont have access to edit/create this topic",
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


	render(){
		var basic_subtopic = {'name':'', 'description':'','content':''};

		if (this.props.topic !== undefined) {

			return (
				<div>
					{this.state.edit ? this.topicEdit() : this.topicShow()}
						<Grid.Column width={16}>
							<Divider />
						</Grid.Column>
					<Grid>
						<Grid.Column width={4} floated="right">
							<Button basic content="New subtopic" onClick={() => {
									this.setState({newSubtopic: true});
									scroller.scrollTo('newsubtopic', {
									  duration: 1000,
									  delay: 0,
									  smooth: true,
									})
								}} />
						</Grid.Column>
					</Grid>

					{
						this.props.topic.subtopics.map(sub => {
		        return (
							<div>
								<SubTopic subtopic={sub} new={false} topicId={this.props.topic.id}/>
								<Grid.Column width={16}>
									<Divider />
								</Grid.Column>
								<br/>
							</div>
						);
					})
				}
				<Element name="newsubtopic" />
				{
					this.state.newSubtopic ?
						<SubTopic subtopic={basic_subtopic} new={true} topicId={this.props.topic.id}/>
						:
						null
				}


				</div>
			);
		} else {
			return(
				null
			)
		}
	}
}
