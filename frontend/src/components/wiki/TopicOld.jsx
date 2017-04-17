import React from 'react'
import { Dimmer, Loader, Grid, Button, Divider, Message, Form, Input} from 'semantic-ui-react'
var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

export class Topic extends React.Component{
	displayName="Topic"
	constructor(props){
		super(props);
		this.state = ({
			id: -1,
			name: '',
			description: '',
			newSubtopic: false,
			edit: false,
			new: false,
			loading: false,
			message: '',
			neg: true,
			subjects: [],
			dropdown_id: 0,
			all_sub_topic: [],
			sub_topics: [],
			prev_sub_topics: []
		});
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

	getSubTopics() {
		//TODO implement
	}

	updateTopicSubTopic() {

	}

	topic() {
		if(this.state.new) {
			return(
				this.edit(
					"Create topic: ",
					this.state.name,
					this.state.description,
					"topic",
					this.state.all_sub_topics,
					((e) => {
						e.preventDefault();
						this.getSubTopics();
						this.setState({
						id: -1,
						name: "",
						description: "",
						subjects: [this.props.subjectId],
						sub_topics: []
					});}),
					((e) => {this.setState({name: e.target.value})}),
					((e) => {this.setState({description: e.target.value})}),
					((e) => {this.handleSave(e,
						'topics/',
						"POST",
						"topic",
						{name: this.state.name, description: this.state.description, subjects: this.state.subjects},
						((res) => {
							if (res.status === 200 || res.status === 201) {
								this.setState({
									message: "Topic created",
									neg: false
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 403) {
								this.setState({
									message: "You dont have access to create this topic",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							}
						})
					)}),
					((e) => {e.preventDefault(); this.setState({
						id: this.props.topic.id,
						name: this.props.topic.name,
						description: this.props.topic.description,
						subjects: this.props.topic.subjects,
						sub_topics: this.state.prev_sub_topics,
						new: false
					})}),
					(() => this.updateTopicSubTopic())
				)
			)
		} else if (this.state.edit) {
			return(
				this.edit(
					"Edit topic: ",
					this.state.name,
					this.state.description,
					"Sub Topics",
					this.state.all_sub_topics,
					((e) => {
						e.preventDefault();
						this.getSubTopics();
						this.setState({
						id: -1,
						new: true,
						edit: false,
						name: "",
						description: "",
						sub_topics: [],
						subjects: [this.props.subjectId]
					})}),
					((e) => {this.setState({name: e.target.value})}),
					((e) => {this.setState({description: e.target.value})}),
					((e) => {this.handleSave(e,
						'topics/' + this.state.id + '/',
						"PUT",
						"topic",
						{name: this.state.name, description: this.state.description, subjects: this.state.subjects},
						((res) => {
							if (res.status === 200 || res.status === 201) {
								this.setState({
									message: "Topic updated",
									neg: false
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 403) {
								this.setState({
									message: "You dont have access to edit/create this topic",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							}
						})
					)}),
					((e) => {e.preventDefault(); this.setState({
						id: this.props.topic.id,
						name: this.props.topic.name,
						description: this.props.topic.description,
						subjects: this.props.topic.subjects,
						sub_topics: this.state.prev_sub_topics,
						edit: false
					})}),
					(() => this.updateTopicSubTopic()),
					((e) => {this.handleSave(e,
						'topics/' + this.state.id + '/',
					 	"DELETE",
						"topics",
						null,
						((res) => {
							if (res.status === 403) {
								this.setState({
									message: "You dont have access to delete this topic",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 204) {
								this.setState({
									message: "topic deleted",
									neg: false,
									edit: false,
									new: false,
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
								this.componentDidMount();
							}
						})
					)})
				));
		} else {
			return(this.show(
				this.state.name,
				this.state.description,
				((e) => {
					e.preventDefault();
					this.setState({
						edit: true
					})
					//get subtopics here
				}),
				((e) => this.setState({
					id: -1,
					new: true,
					name: "",
					description: "",
					sub_topics: [],
				}))
			));
		}
	}

	render(){
		var basic_subtopic = {'name':'', 'description':'','content':''};

		if (this.props.topic !== undefined && !this.state.new) {

			return (
        <div>yes</div>
      );
    } else {
      return (
        <div>no</div>
      )
    }
	}
}
