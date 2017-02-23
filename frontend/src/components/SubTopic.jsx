import React from 'react'

export class SubTopic extends React.Component {
	// lete i databasen etter tekst som man skal vise
	constructor(props){
		super(props);
		this.state={
			contentList: []
		};

	}


	render(){
		return <h1>{fetchData()}</h1>;
	}	
}
