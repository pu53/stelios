import React, { Component } from 'react'
import { QuizStatistics } from './QuizStatistics'

export class StatPage extends Component {
	constructor(props){
		super();
		this.state={
			
		}
	}
	
	render(){
		return(
		<div className="statPageWrapper">
			<QuizStatistics 
				statId={this.props.params.statId}
				metric="percentage"
				type="table"
				scope="quiz"/>
		</div>
		);
	}
}
