import React, { Component } from 'react';
import './quiz.css'
import { Container, Segment } from 'semantic-ui-react';
import { FeedbackContainer } from './Feedback.jsx';

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

		if(userID === null){
			console.log("Not logged in, quiz will not be saved");
			return;
		}

		var result={
			quizID:this.props.data.id,
			userID:userID,
			questions:this.state.questions,
			answers:this.state.answers
		}
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

	//Helper method for rudementary feedback
	areEqual(a, b) {
		console.log("A: " + a + " B: " + b)
		if(a===b) {
			return("True")
		}
		else {
			return("False")
		}
	}

	render() {
		/*TODO: Make the quiz generate a title if none is specified*/
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
							About: {this.state.questions[this.state.currently_asking-1].subtopic}
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
					<h1>the quiz is finished!</h1>
					{
						this.state.answers.map((answer)=>{
							counter++;
							return <div key={this.state.questions[counter].id}>
								 Question: {this.state.questions[counter].id}
								 Answer: {answer} </div>
						})
					}
					<FeedbackContainer answers={this.state.answers} subtopics={this.state.questions.map((question) => question.subtopic)}/>
				</Container>
			);
		}
	}
}

/*Representing a single question in a quiz. Manages the answer selection*/
class Question extends Component {
	constructor(props) {
		super(props);
		this.state= {
			chosenAnswer:-1,
			number:0,
			data: this.props.data,
			firstQuestion:false,
			lastQuestion:false
			};
		this.changeToggle = this.changeToggle.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);
	}

	componentDidMount() {
		this.setState({
			data:this.props.data,
			firstQuestion:this.props.firstQuestion,
			lastQuestion:this.props.lastQuestion,
		});

		if(this.props.chosen !== undefined) {
			this.setState({
				chosenAnswer:this.props.chosen
			});
		}
	}

	changeToggle(id) {
		/*console.log("Callback from" + id);*/
		if(id === this.state.chosenAnswer) {
			this.setState({chosenAnswer:-1});
		}
		else {
			this.setState({chosenAnswer:id});
		}
	}

	nextQuestion() {
		//console.log("internaly chosen: " + this.state.chosenAnswer);
		this.props.onChange(1,this.state.chosenAnswer);
	}

	prevQuestion() {
		//console.log("internaly chosen: " + this.state.chosenAnswer);
		this.props.onChange(-1, this.state.chosenAnswer);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data:nextProps.data,
			firstQuestion:nextProps.firstQuestion,
			lastQuestion:nextProps.lastQuestion,
			chosenAnswer:nextProps.chosen
		});
	}

	render() {
		/*defining styles within render like this is probably not great
		 * but for the first draft it's ok*/

		var styleNavButtonPrev= {
			minHeight:'50px',
			backgroundColor:'#6c6c6c',
			color:'#ffffff',
			minWidth:'50%',
			position:'relative',
			display:'flex',
			alignItems:'center',
			borderRadius:'10px',
			visibility:'visible',
			cursor: 'default'
		}
		var styleNavButtonNext= {
			minHeight:'50px',
			backgroundColor:'#6c6c6c',
			color:'#ffffff',
			minWidth:'50%',
			position:'relative',
			display:'flex',
			alignItems:'center',
			borderRadius:'10px'
		}

		/*
		var style3= {
			textAlign:'center',
			width:'100%',
			MozUserSelect:'none',
			WebkitUserSelect:'none',
			MsUserSelect:'none',
			UserSelect:'none'
		};
		*/

		/*chechs to see if any of the navbuttons needs adjustment for first/last*/
		/*Nice pale error red:#EF4E45*/
		var nextText='Next';
		/*var backgroundColor = '#6c6c6c'*/
		/*var cursor = ''*/


		if(this.state.lastQuestion===true) {
			nextText='Finish';
			styleNavButtonNext.backgroundColor='#5EBC43';
		}

		if(this.state.firstQuestion===true) {
			styleNavButtonPrev.cursor='default';
		}
		else {
			styleNavButtonPrev.visibility='visible';
			styleNavButtonPrev.cursor='pointer';
		}

		return (
			<div className="styleQuestion" >
				<div className="styleText" >
					{this.state.data["text"]}
				</div>
				{/*chosen:{this.state.chosenAnswer}*/}
				<div>
					{
						this.state.data.choices.map((choice)=> {
							return(
								<Answer
								key={choice.choice_text}
								opNr={choice.id}
								text={choice.choice_text}
								toggleCallback={this.changeToggle}
								curOn={this.state.chosenAnswer}/>)
						})
					}

					<div className="styleNavButtons" >
						<button className="styleNavButtonPrev" style={styleNavButtonPrev} onClick={this.prevQuestion} disabled={this.state.firstQuestion}>
							<div className="navText">Previous</div>
						</button>
						<button className="styleNavButtonNext" style={styleNavButtonNext} onClick={this.nextQuestion}>
							<div className="navText">{nextText}</div>
						</button>
					</div>
				</div>
			</div>
		)
	}
}
/*A simple custom button for presenting an answer option. What option is toggled is
 * monitored from the Question owning the answer. The parent question monitores
 * answers via a callback passed through the prop*/
class Answer extends Component {
	constructor(props) {
		super(props);
		this.state= {
			chosen:false,
			idNum:this.props.opNr,
			text:this.props.text
			};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		this.props.toggleCallback(this.state.idNum);
	}

	componentWillMount() {
		if(this.props.curOn === this.state.idNum) {
			this.setState({chosen:true});
		}
		else {
			this.setState({chosen:false});
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.curOn === this.state.idNum) {
			this.setState({chosen:true});
		}
		else {
			this.setState({chosen:false});
		}
	}

	render() {
		/*console.log("render number " +this.state.idNum+ ", chosen=" + this.state.chosen);*/
		var background ='';
		if(this.state.chosen) {
			background='#4C7CFF';
		}
		else {
			background='#68B1FF';
		}

		return (
			<div className="answerWrapper">
				<button className="answerStyle1" style={{backgroundColor:background}} onClick={this.handleChange}>
					<div className="answerStyle2">
						Option {this.state.idNum}: {this.state.text}
					</div>
				</button>
			</div>
			)
	}
}
