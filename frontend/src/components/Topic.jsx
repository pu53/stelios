import React from 'react'
import { SubTopic } from './SubTopic'
import { Dimmer, Loader } from 'semantic-ui-react'

export class Topic extends React.Component{
	constructor(props){
		super(props);
	}

	render(){
		console.log(this.props.topic);
		if (this.props.topic !== undefined) {

			return (
				<div>
					<h2>Topic name: {this.props.topic.name}</h2>
					<h3>{this.props.topic.description}</h3>
					<br/>
					{
						this.props.topic.subtopics.map(sub => {
		        return (
						<div>
							<SubTopic subtopic={sub} />
							<br/>
						</div>
						);
					})
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
