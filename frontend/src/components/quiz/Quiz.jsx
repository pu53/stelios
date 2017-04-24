import React, { Component } from 'react';
import './quiz.css'
import { Container, Segment } from 'semantic-ui-react';
import { FeedbackContainer } from './Feedback.jsx';
import { Question } from './Question.jsx'
import { sendData } from '../../helpers.jsx'

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

		//Checks whether the current session is a user or not. If the session
		//taking the quiz is not a logged in user, the immidiate feedback will be
		//visible as normal, but the results will not be saved
		var userID = localStorage.getItem('stelios_current_user')
		if(userID === 'null'){
			console.log("Not logged in, quiz will not be saved");
			return;
		}
		//Wraps the answer data in a dictionary, ready to be sent to backend
		var result={
			quizID:this.props.data.id,
			userID:userID,
			questions:this.state.questions,
			choices:this.state.answers,
		};

		//Uses the helper method to post the data
		sendData("result/quiz/save/","post",result,(()=>{}),(()=>{}),(()=>{}))
	}

	/*Updates the answer internally*/
	changeQuestion(increment, chosenAlternative) {
		if(chosenAlternative===undefined){chosenAlternative=-1}
		if(this.state.currently_asking + increment < 1){

		}
		else if(this.state.currently_asking + increment > this.state.number_of_questions){
			var tempAnswers=this.state.answers;
			tempAnswers[this.state.currently_asking-1] = chosenAlternative;
			
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
		// About: {this.state.questions[this.state.currently_asking-1].subtopic.map((subtopic) => {subtopic.name})}
		if(this.state.finished===false) {
			const subtopics = this.state.questions[this.state.currently_asking-1].subtopic;
			var subtopicNames = [];
			for (var i = 0; i < subtopics.length; i++) {
				subtopicNames.push(subtopics[i].name);
			}
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
							About: {subtopicNames.map((name) => {
								return(<k key="name">{name}, </k>);
							})}
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
			return(
				<Container className="quizWrapper">
					<h1>The quiz is finished!</h1>
					<FeedbackContainer answers={this.state.answers} quizid={this.props.data.id} subtopics={this.state.questions.map((question) => question.subtopic.map((subtopic) => subtopic.id))}/>
				</Container>
			);
		}
	}
}
