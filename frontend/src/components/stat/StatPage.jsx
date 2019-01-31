import React, { Component } from 'react'
import { QuizStatistics } from './QuizStatistics'
import { getData } from '../../helpers'

//main entry point for statpage
export class StatPage extends Component {
	constructor(props){
		super();
		this.state={
			noStat: false,
			data: [],
			quizId: -1,
			quizTitle: '',
			questions: [],
			dataLoading: true,
			dataLoading2: true,
			quizQuestionsData: []
		}
	}

	componentWillMount() {
		//get statId from url
		var id = this.props.params.statId
		if (id === undefined) {
			this.setState({
				noStat: true,
			})
		} else {
			//if there is a id in url
			//get data
			this.getQuiz(id)
			this.getStatistics(id)
		}
	}

	getQuiz = (id) => {
		var url = "quiz/data/" + id + "?fields=questions"
		var handleStatus = () => {}
		var handleData = (res) => {
			this.setState({
				quizQuestionsData: res.questions,
				dataLoading2: false
			})
		}
		var handleError = () => {}
		getData(url, handleStatus, handleData, handleError)
	}

	getStatistics = (id) => {
		var url = "result/stats/percentage/quiz/" + id + "/" //masive url don't ask
		var handleStatus = (res) => {}
		var handleData = (res) => {
			var questions = []
			var last_question = res.answers[0].questionID
			var current_question = []
			//WARNING most of these variables are strings not numbers
			//makes a question array and pushes all answers to the one question
			res.answers.map((answer) => {
				if (last_question !== answer.questionID) {
					last_question = answer.questionID;
					questions.push(current_question)
					current_question = []
				}
				current_question.push(answer)
			})
			//after the loop there is still something in current_question
			if(current_question.length > 0) {
				questions.push(current_question)
			}
			var newQuestions = []
			//now questions contains arrays of single questions
			questions.map((question) => {
				var newQuestion = []
				var last_answer_id = question[0].choiceID
				var current_answers = []
				question.map((answer) => {
					if(last_answer_id !== answer.choiceID) {
						last_answer_id = answer.choiceID
						newQuestion.push(current_answers)
						current_answers = []
					}
					current_answers.push(answer)
				})
				if (current_answers.length > 0) {
					newQuestion.push(current_answers)
				}
				newQuestions.push(newQuestion)
			})
			// now newQuestions is an array containing arrays of each question. each question is containing arrays, each array is a choice, wich contains all choices that belong to this choice
			this.setState({
				quizId: res.id,
				quizTitle: res.title,
				questions: newQuestions,
				dataLoading: false,
			})
			//questions is now an array containing an arrays of each question
			console.log("data finish");
		}
		var handleError = (res) => {}
		getData(url,handleStatus,handleData, handleError)
	}

	render(){
		if (this.state.noStat) {
			return(
				<p>no url was supplied, go to your userpage and select a quiz</p>
			)
		} else if (this.state.dataLoading || this.state.dataLoading2) {
			return(
				<p>Loading...</p>
			)
		} else {
			return(
				<div className="statPageWrapper">
					<QuizStatistics
						statId={this.state.statId}
						quizId={this.state.quizId}
						quizTitle={this.state.quizTitle}
						questions={this.state.questions}
						quizQuestionsData={this.state.quizQuestionsData}
						/>
					<br />
				</div>
				);
			}
	}
}
