import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx'
import './quiz_statistics.css'

/*
 * A component containing a table/graph containing data from a specific quiz
 */
export class StatChoice extends Component {
	constructor(props) {
		super(props);
		this.state={
			choice: props.choice,
			text: '',
			isCorrect: false
		};
	}

	componentWillMount(){
		if(this.state.choice.length > 0) {
			this.getChoiceData(this.state.choice[0].choiceID)
		}
	}

	componentWillReciveProps(nextProps){
		if(this.state.choice !== nextProps.choice) {
			this.setState({
				choice: nextProps.choice
			})
			if(nextProps.choice.length > 0) {
				this.getChoiceData(nextProps.choice[0].choiceID)
			}
		}
	}

	getChoiceData = (id) => {
		var url = "choice/" + id + "?fields=choice_text,is_correct"
		var handleStatus = (res) => {}
		var handleData = (res) => {
			this.setState({
				text: res.choice_text,
				isCorrect: res.is_correct,
			})
			console.log(res.choice_text, res.is_correct);
		}
		var handleError = (res) => {}
		getData(url,handleStatus,handleData,handleError)
	}

	render() {
		return(
			<Table.Row positive={this.state.isCorrect}>
				<Table.Cell width={12}>
					{this.state.text}
				</Table.Cell>
				<Table.Cell>Cell</Table.Cell>
				<Table.Cell>Cell</Table.Cell>
			</Table.Row>
		)
	}
}
