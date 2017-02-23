import React from 'react'
import { SubTopic } from './SubTopic'

export class Topic extends React.Component{
	constructor(props){
		super(props);
	}


	render(){
		var subtopics=this.props.topic["subtopics"]
		return (
			<div>
				<h2>Topic name: {this.props.topic["name"]}</h2>
				<h3>{this.props.topic["description"]}</h3>
				<br/>
				{
					Object.keys(subtopics).map(function(key){
	        return (
						<div>
							<SubTopic subtopic={subtopics[key]} />
							<br/>
						</div>
					);
	    	})}

			</div>
		);
	}

}
