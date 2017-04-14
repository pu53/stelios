import React, { Component } from 'react';
import './quiz.css'
import { Container, Segment } from 'semantic-ui-react';
import { FeedbackContainer } from './Feedback.jsx';
import { Question } from './Question.jsx'

import { sendData } from '../../helpers.jsx' 
/**TODO: Make nav buttons stay in the same place?
 * TODO: Quiz generation
 * TODO: Scramble order of alternatives
 */ 

/**TODO: Make nav buttons stay in the same place?
 * TODO: Quiz generation
 * TODO: Scramble order of alternatives
 * TODO: Show earlier answers
 */


/*The head element of a quiz. Fetches all the data for all the quiestions included
 * in the quiz and passes them on to the subcomponents when needed*/
export class Quiz extends Component {
	/* Props:
	 * numberOfQuestions
	 * inOrder # Thinking either this one or randomised as a bool.
	 *         # Question order allways scrambeled within a single subtopic
	 */
	constructor(props) {
		super(props);

		/*The quiz state contains info on the quiz, and what answers have been
		 * selected*/
		this.state = {
			finished:false,
			number_of_questions:0,
			currently_asking:1,
			title:"No title found",
			questions:[],
			answers:[]
			};

		this.changeQuestion=this.changeQuestion.bind(this);
	}

	componentWillMount() {
		this.fetchData();
	}

	componentWillReceiveProps(nextProps) {
		this.fetchData();
	}

	fetchData() {
		if (this.props.data !== undefined) {
			console.log("The quiz received this data");
			console.log(this.props.data)
			this.setState({
				title:this.props.data.title,
				questions:this.props.data.questions,
				number_of_questions:this.props.data.questions.length
			});
		}
		else {
			console.error("Give the quiz element some data!")
		}

		var all_answers = [];

		for(var i=0; i<this.props.data.questions.length;i++) {
			all_answers[i]=-1;
		}

		this.setState({
			answers:all_answers
		});
	}

	/*Sends the result back to the server*/
	postAnswers(){

		/*var quizID = this.props.data.id*/
		var userID = localStorage.getItem('stelios_current_user')
		//console.log("Current user on quiz result save: " + userID)
		
		if(userID === null){
			console.log("Not logged in, quiz will not be saved");
			return;
		}

		var result={
			quizID:this.props.data.id,
			userID:userID,
			questions:this.state.questions,
			choices:this.state.answers,
		};
		//sendData(url, method_, body, handleStatus, handleData, handleError)
		sendData("result/quiz/save/","post",result,(()=>{}),(()=>{}),(()=>{}))
		
		console.log("Current user: " + result.userID);
	}

	/*Updates the answer*/
	changeQuestion(increment, chosenAlternative) {
		if(chosenAlternative===undefined){chosenAlternative=-1}
		if(this.state.currently_asking + increment < 1){

		}
		else if(this.state.currently_asking + increment > this.state.number_of_questions){
			var tempAnswers=this.state.answers;
			tempAnswers[this.state.currently_asking-1] = chosenAlternative;
			console.log("finished");
			this.setState({
				finished:true,
				answers:tempAnswers
			});
		}
		else {
			var tempAnsw=this.state.answers;
			tempAnsw[this.state.currently_asking-1] = chosenAlternative;
			this.setState({
				answers:tempAnsw,
				currently_asking:this.state.currently_asking+increment
			});
		}
	}

	render() {
		if(this.state.finished===false) {
			return (
			<Container className="quizWrapper">
				<div className="quizContainer">
					<h1 className="mainTitle">
						{this.state.title}
					</h1>
					<div className="topInfo">
						<div className="topInfoProgres">
							Question: {this.state.currently_asking}/{this.state.number_of_questions}
						</div>
						<div className="topInfoSubTopic">
							About: {this.state.questions[this.state.currently_asking-1].subtopic.name}
						</div>
					</div>
					<div>
						<Question
							data={this.state.questions[this.state.currently_asking-1]}
							onChange={this.changeQuestion}
							firstQuestion={this.state.currently_asking === 1}
							lastQuestion={this.state.currently_asking === this.state.number_of_questions}
							chosen={this.state.answers[this.state.currently_asking-1]}/>
					</div>
				</div>
			</Container>
		);
		}
		else {
			this.postAnswers()

			var counter=-1;
			// Correct:{this.areEqual(answer,this.state.questions[counter].correct_answer[0].id)}
			return(
				<Container className="quizWrapper">
					<h1>The quiz is finished!</h1>
					<FeedbackContainer answers={this.state.answers} subtopics={this.state.questions.map((question) => question.subtopic)}/>
				</Container>
			);
		}
	}
}
