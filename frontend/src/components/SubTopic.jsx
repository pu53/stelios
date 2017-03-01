import React from 'react'
var Remarkable = require('remarkable');

export class SubTopic extends React.Component {
	constructor(props){
		super(props);
	}


	render(){
		var content = this.props.subtopic["content"];
		var md = new Remarkable('full', {
			html: true,
			linkify: true,
			typographer: true
	 	});
		return (
			<div>
				<h3>Subtopic: {this.props.subtopic["name"]}</h3>
				<h4>{this.props.subtopic["description"]}</h4>
				<br></br>
				<div dangerouslySetInnerHTML={{__html: md.render(content)}} />
			</div>
		);
	}
}
