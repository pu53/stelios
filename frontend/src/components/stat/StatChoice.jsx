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
			isCorrect: false,
		};
	}

	componentWillMount(){
		if (this.props.missingChoice !== undefined) {
			this.getChoiceData(this.props.missingChoice.id)
		} else if(this.state.choice.length > 0) {
			this.getChoiceData(this.state.choice[0].choiceID)
		}
	}

	componentWillReciveProps(nextProps){
		if(nextProps.missingChoice !== undefined) {
			this.getChoiceData(nextProps.missingChoice.id)
		}
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
		console.log(id, typeof id);
		if(id !== null) {
			var url = "choice/" + id + "?fields=choice_text,is_correct"
			var handleStatus = (res) => {}
			var handleData = (res) => {
				this.setState({
					text: res.choice_text,
					isCorrect: res.is_correct,
				})
			}
			var handleError = (res) => {}
			getData(url,handleStatus,handleData,handleError)
		} else {
			this.setState({
				text: "Not answered",
				isCorrect: false
			})
		}
	}

	render() {
		return(
			<Table.Row positive={this.state.isCorrect}>
				<Table.Cell width={12}>
					{this.state.text}
				</Table.Cell>
				<Table.Cell>{this.props.missingChoice !== undefined ? 0 : this.state.choice.length}</Table.Cell>
				<Table.Cell>{this.props.missingChoice !== undefined ? 0 : Math.round((this.state.choice.length/this.props.totalNumberOfAnswers) * 100)}</Table.Cell>
			</Table.Row>
		)
	}
}
