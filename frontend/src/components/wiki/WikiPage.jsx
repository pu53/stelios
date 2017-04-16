import React from 'react'
import { Grid, Divider, Segment } from 'semantic-ui-react'
import { Subject } from './Subject'
import { Topic } from './Topic'
import { TopicNav } from './TopicNav'
import { getData } from '../../helpers'
import { CustomMessage } from './CustomMessage'

//supposed to render a single subject w/topics, preferably with jabbe
export class WikiPage extends React.Component{
	displayName="WikiPage"
	constructor(props){
		super(props);

		this.state = ({
			result: [],
			topics_id: [],
			active_topic: undefined,
			prev_active_topic: undefined,
			new: false,
			loading: false,

			status: -1,
			message: '',
			neg: false,


			subjectId: -1,
			topics: [],
			activeTopicId: -1,
			block_message: false,
		});
	}

	onSubjectNew = () => {
		this.setState({
			new: true
		})
	}

	onSubjectNotNew = () => {
		this.setState({
			new: false
		})
	}

	blockMessage = (status,message,neg) => {
		this.setState({
			status, message, neg, blockMessage: true
		})
		setTimeout(() => this.setState({blockMessage: false}), 3000)
	}

	onChangeMessage = (status,message='',neg=false) => {
		this.setState({
			status,message,neg
		})
	}

	onSubjectSubmit = (id, newSub=false) => {
		this.setState({
			subjectId: id,
			new: false
		})
		if (newSub) {
			this.setState({
				topics: [],
				active_topic_id: -1
			})
		}
		this.props.router.push('/wiki/'+id);
		window.location.reload();
	}

	onTopicSubmit = (activeTopicId,newTop=false) => {
		this.setState({
			activeTopicId
		})
		this.props.router.push('/wiki/'+this.state.subjectId + '/' + activeTopicId + '/');
	}

	getAllSubjects = (id) => {
		var url = "subjects/?fields=id,name";
		var handleStatus = (res) => {}
		var handleData = (res) => {
			if (!res.some((subject) => { return subject.id === id})) {

				if (id !== undefined) {
					if (!this.state.blockMessage) {
						this.setState({
							message: "Subject not found, reverting to first subject",
							status: -1,
							neg: true
						})
					}
				}
				id = res[0].id
			}
			this.setState({
				subjectId: id
			})
		}

		var handleError = (e) => {
			this.setState({
				message: e,
				status: -1,
				neg: true
			})
		}

		getData(url, handleStatus, handleData, handleError);
	}

	updateTopics = (res) => {
		var id = this.props.params.topicId;
		if (id !== undefined) {
			id = parseInt(id, 10)
			if(res.topics.some((topic) => {
				return topic.id === id
			})) {
				var activeTopicId = id
			} else {
				var activeTopicId = res.topics[0] !== undefined ? res.topics[0].id : -1
			}
		}
		console.log("in updateTopics", id, activeTopicId);
		this.setState({
			topics: res.topics,
			activeTopicId
		})
		this.props.router.push('/wiki/'+this.state.subjectId + '/' + activeTopicId + '/');
	}

	//when the component mounts we want to fetch data from the server
	componentDidMount() {
		var id = this.props.params.subjectId;
		if (id !== undefined) {
			id = parseInt(id, 10)
		}
		this.getAllSubjects(id);
	}

	triggerRefresh = () => {
		this.componentDidMount()
	}

	clickTopic = (id) => {
		this.setState({
			activeTopicId: id
		})
		this.props.router.push('/wiki/'+this.state.subjectId + '/' + id + '/');
	}

	render() {
		console.log(this.state);
		if(this.state.result !== []) {
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={16}>
							<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
						</Grid.Column>
						<Grid.Column width={16}>
							<Segment>
								<Subject raised
									{...this.props}
									updateTopics = {this.updateTopics}
									onSubjectNew={this.onSubjectNew}
									onSubjectNotNew={this.onSubjectNotNew}
									subjectId={this.state.subjectId}
									onParentSubmit={this.onSubjectSubmit}
									triggerRefresh={this.triggerRefresh}
									blockMessage={this.blockMessage}
									/>
							</Segment>
							<br />
						</Grid.Column>
						<Grid.Column width={3}>
							<TopicNav
								{...this.props}
								subjectId={this.state.subjectId}
								topics={!this.state.new ? this.state.topics : undefined}
								clickTopic={this.clickTopic}
								onChangeMessage={this.onChangeMessage}
								updateTopics={this.updateTopics}
								/>
						</Grid.Column>
						<Grid.Column width={13}>
							<Segment raised>

								{!this.state.new ?
									<Topic
										{...this.props}
										activeTopicId={this.state.activeTopicId}
										topics={this.state.topics}
										subjectId={this.state.subjectId}
										onParentSubmit={this.onTopicSubmit}
										triggerRefresh={this.triggerRefresh}
										blockMessage={this.blockMessage}
										/>
								:
								null
								}
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			)
		} else {
			return(
				<div>loading</div>
			)
		}
	}
}
