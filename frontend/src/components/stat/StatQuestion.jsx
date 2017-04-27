import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx'
import './quiz_statistics.css'
import { StatChoice } from './StatChoice'
import { Chart } from 'react-google-charts';
/*
 * A component containing a table/graph containing data from a specific quiz
 */
export class StatQuestion extends Component {
	constructor(props) {
		super(props);
		this.state={
			question: props.question,
			text: '',
			questionId: -1,
			totalNumberOfAnswers: 0,
			missingChoices: [],
			choices: [['Choice text', 'amount of answers']]
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
				totalNumberOfAnswers: number,
				questionId: this.state.question[0][0].questionID
			})
			this.checkIfAnyChoicesNotIncluded(this.state.question[0][0].questionID)
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
				totalNumberOfAnswers: number,
				questionId: this.state.question[0][0].questionID
			})
			if(nextProps.question.length > 0 && this.state.question[0].length > 0) {
				this.getQuestionData(nextProps.question[0][0].questionID)
				this.checkIfAnyChoicesNotIncluded(this.state.question[0][0].questionID)
			}
		}
	}

	checkIfAnyChoicesNotIncluded = (id) => {
		//iterate the quiz data, when questionId matches id, do another iteration
		if(id !== -1){
			console.log("quizQuestionsData", this.props.quizQuestionsData);
			if(this.props.quizQuestionsData !== undefined && this.props.quizQuestionsData !== []) {
				this.props.quizQuestionsData.map((question) => {
					if(question.id === id) {
						//check if there are some choices that are not present in this.state.question
						var missing_choises = []
						console.log(question);
						question.choices.map((choice) => {
							//checks if choice is in one or more of the answers
							var isAny = this.state.question.some((answer) => {
								console.log("kappa", choice.id, answer[0].choiceID);
								return parseInt(choice.id) === parseInt(answer[0].choiceID)
							})
							if (!isAny) {
								missing_choises.push(choice)
							}
						})
						console.log("missing choices" , missing_choises);
						this.setState({
							missingChoices: missing_choises
						})
					}
				})
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

	updateChoices = (choice) => {
		var choices = JSON.parse(JSON.stringify(this.state.choices));
		choices.push(choice)
		this.setState({
			choices
		})
	}

	render() {
		console.log(this.state.amountsOfNotAnswered);
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
								return(<StatChoice {...this.props}
													totalNumberOfAnswers={this.state.totalNumberOfAnswers}
													choice={choice}
													updateChoices={this.updateChoices}
													/>)
							})}
							{ this.state.missingChoices !== [] ? this.state.missingChoices.map((missingChoice) => {
								return(<StatChoice {...this.props} missingChoice={missingChoice} />)
							}) : null}
							<Table.Row>
								{/* Creating a pie chart of the results*/}
								<Table.Cell colSpan='3'>
									{
									this.state.question.length === this.state.choices.length - 1 ?
										<Chart
											chartType='PieChart'
											width= '100%'
											data= {this.state.choices}
											options= {{
												title: 'Answers to quiz',
												pieHole: 0.4,
												is3D: true,
											}}
										/>
									:
									null
								 }
								</Table.Cell>
							</Table.Row>
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
