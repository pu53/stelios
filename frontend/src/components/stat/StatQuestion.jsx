import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx'
import './quiz_statistics.css'
import { StatChoice } from './StatChoice'

/*
 * A component containing a table/graph containing data from a specific quiz
 */
export class StatQuestion extends Component {
	constructor(props) {
		super(props);
		this.state={
			question: props.question,
			text: '',
			totalNumberOfAnswers: 0
		};
	}

	componentWillMount(){
		if(this.state.question.length > 0 && this.state.question[0].length > 0) {
			this.getQuestionData(this.state.question[0][0].questionID)
			var number = 0
			this.state.question.map((choice) => {
				number += choice.length
			})
			this.setState({
				totalNumberOfAnswers: number
			})
		}
	}

	componentWillReciveProps(nextProps){
		if(this.state.question !== nextProps.question) {
			var number = 0
			nextProps.question.map((choice) => {
				number += choice.length
			})
			this.setState({
				question: nextProps.question,
				totalNumberOfAnswers: number
			})
			if(nextProps.question.length > 0 && this.state.question[0].length > 0) {
				this.getQuestionData(nextProps.question[0][0].questionID)
			}
		}
	}

	getQuestionData = (id) => {
		var url = "question/" + id + "?fields=text"
		var handleStatus = (res) => {}
		var handleData = (res) => {
			this.setState({
				text: res.text
			})
		}
		var handleError = (res) => {}
		getData(url,handleStatus,handleData,handleError)
	}

	render() {
		if(this.state.question.length > 0 ){
			return(
				<div className="singleTableWrapper">
					<Table celled unstackable>
						<Table.Header>
							<Table.Row>
								<Table.HeaderCell width={12}>{this.state.text}</Table.HeaderCell>
								<Table.HeaderCell>Answers</Table.HeaderCell>
								<Table.HeaderCell>%</Table.HeaderCell>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{this.state.question.map((choice) => {
								return(<StatChoice {...this.props} totalNumberOfAnswers={this.state.totalNumberOfAnswers} choice={choice} />)
							})}
						</Table.Body>
					</Table>
					<br />
				</div>
			)
		} else {
			return null
		}
	}
}
