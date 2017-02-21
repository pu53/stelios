import React from 'react'

export class Topic extends React.Component{
	constructor(props){
		super(props);
		this.state=({
			isAdmin: props.isAdmin
		});
		this.header = <h1>{props.header}</h1>;
		this.fill = <div>{props.fill}</div>;
		this.subtopics = props.subtopics;
	}	


	render(){
		return (
			<div>
				{this.header} 
				{this.fill}
				<EditButton isAdmin={this.state.isAdmin} />
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
