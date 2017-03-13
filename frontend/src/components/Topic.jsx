import React from 'react'
import { SubTopic } from './SubTopic'
import { Dimmer, Loader, Grid, Button, Divider} from 'semantic-ui-react'
var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

export class Topic extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
			newSubtopic: false
		})
	}

	render(){
		var basic_subtopic = {'name':'', 'description':'','content':''};

		if (this.props.topic !== undefined) {

			return (
				<div>
					<Grid>
						<Grid.Column width={12}>
							<h2>Topic name: {this.props.topic.name}</h2>
						</Grid.Column>
						<Grid.Column width={4}>
							<Button.Group basic float="right">
								<Button content="Edit" />
								<Button content="New" />
							</Button.Group>
						</Grid.Column>
					</Grid>
					<br/>
					<p><b>{this.props.topic.description}</b></p>
					<br/>
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
			console.log("wha");
			return(
				<Dimmer active inverted>
					<Loader inverted>Loading</Loader>
				</Dimmer>
			);
		}
	}
}
