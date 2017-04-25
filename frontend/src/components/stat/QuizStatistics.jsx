import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx'
import './quiz_statistics.css'
import { StatQuestion } from './StatQuestion'
/*
 * A component containing a table/graph containing data from a specific quiz
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

	/* Requests statistical data from the server. If the user is not authenticicated,
	 * an error flag will be set accordingly */
	 /*
	fetchData() {
		let userId = localStorage.getItem('stelios_current_user')
		if(userId === 'null')
			return;

		//Fetches data from the correct api endpoint and loads it into state
		let url = "result/stats/"+this.props.metric+"/"+this.props.scope+"/"+this.props.statId+"/";
		getData(
			url,
			(res)=>{
				this.setState({
					statusMsg:res
				})
			},
			(res)=>{
				this.setState({
					data:res},
					()=>{
					// This setState is set to be called after the one directly
					 // above, to ensure that this.state.data actually contains
					 // anything first
					this.setState({
						title: this.state.data.title,
						id: this.state.data.id
					})
				})
			},
			()=>{});

	} */
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

	//Generates the entire table view
	generateStatisticView() {
		if(this.state.questions.length !==0){
			return(
			<div>
					{this.state.questions.map((question) => {
					return(<StatQuestion {...this.props} question={question} />)
					})}
			</div>
			);
		}

		else {
			return<div className="loadingText">loading data...</div>
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
					{this.generateStatisticView()}
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
