import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx'
import './quiz_statistics.css'
import { StatQuestion } from './StatQuestion'
/*
 * A component containing a table and graph displaying quiz data
 */
export class QuizStatistics extends Component {
	constructor(props) {
		super(props);
		this.state={
			loggedIn: false,
			questions: props.questions
		};
	}

	componentWillMount(){
		this.checkLoggedIn()
	}
	componentWillUpdate() {
		this.checkLoggedIn()
	}

	componentWillReciveProps(nextProps){
		if (this.state.questions !== nextProps.questions){
			this.setState({
				questions: nextProps.questions
			})
		}
	}
	
	checkLoggedIn() {
		if(localStorage.getItem('stelios_current_user') === 'null'){
			this.setState({
				loggedIn: false
			})
		}
		else {
			this.setState({
				loggedIn: true
			})
		}
	}


	render() {
		/* Checks whether the current user has been authorized
		 * before trying to display the stats
		 */
		if(this.state.loggedIn){
			return(
			<div>
				<div className="mainTitle">
					Statistics for the quiz: {this.props.quizTitle}
				</div>

				<div className="tableContainerWrapper">
					{
						this.state.questions.length !== 0 ?
						this.state.questions.map((question) => {
							return(<StatQuestion {...this.props} question={question} />)
						})
						:
						<p>loading data...</p>
					}
				</div>
			</div>
			)
		}
		//If the user was not allowed to view the data, an error message is displayed
		return(
			<div className="statPageWrapper">
				<div className="notAuthMsg">
					Sorry, you are not permitted to view the statistics for this quiz.
				</div>
			</div>
		);
	}
}
