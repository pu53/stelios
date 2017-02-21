import React from 'react'

import {Topic} from './Topic'

//supposed to render a single subject w/topics
export class WikiPage extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
			isAdmin: props.isAdmin
		});
		this.topics = props.topics;
		this.elms = props.elms;
	}

	render(){
		return 	(<div> 
					Hello Worlds!
					<ListIt elms={this.elms} />
				</div>);
	}
}

function ListIt(props){

		const elms = props.elms;

		const listelms = elms.map((elm) =>
			<Topic isAdmin={true} header={elm} fill="fill"/>
		);

		return (
			<div>
				{listelms}
			</div>
			);
	}
