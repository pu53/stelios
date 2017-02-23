import React from 'react'

export class Topic extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
			id: props.id,
			name: props.name,
			description: props.description,
			subtopics: props.subtopics
		});
		this.getSubTopics = this.getSubTopics.bind(this);
	}	

	getSubTopics(){

	}


	render(){
		return (
			<div>
				{this.state.name}		
			</div>
		);
	}

}

//button to edit if admin
function EditButton(props){
	return (props.isAdmin ? (
			<button>edit</button>
		) : (
			null
		)
	);
}
