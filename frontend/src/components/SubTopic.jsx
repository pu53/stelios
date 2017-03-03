import React from 'react'
var ReactMarkdown = require('react-markdown');

export class SubTopic extends React.Component {
	constructor(props){
		super(props);
	}
	
	
	render(){
		var content = this.props.subtopic["content"];
		return (
			<div>
				<h3>Subtopic: {this.props.subtopic["name"]}</h3>
				<h4>{this.props.subtopic["description"]}</h4>
				<br></br>
				<ReactMarkdown source={content} />
			</div>
		);
	}
}
