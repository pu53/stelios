import React, { Component } from 'react';
import '../styles/quiz.css'
import { Container, Segment } from 'semantic-ui-react';

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
			title:"This is a quiz about something",
			questions:[],
			answers:[]
			};
		
		this.changeQuestion=this.changeQuestion.bind(this);
	}

	componentWillMount() {
		this.fetchData();
	}

	/*
	 * If the quiz is a saved quiz, (explicitly saved with an id), the component
	 * should load relevant data. Otherwise it can either take a dictionary
	 * with data passed by props to turn into a quiz, or get a list of topics, 
	 * subtopics and subjects and use these to generate a quiz. Pass topics etc
	 * via id
	 *
	 * Quiz data format: 
	 * 	{
	 * 		title:String #bonus feature:if undefined, generate name based on contents
	 * 		subjects:[] 
	 * 		topics:[]
	 * 		sub-topics:[] #subjects and topics gets broken down into sub-topics
	 * 		questions:[]
	 *  }
	 * 
	 * Question data format:
	 * {
	 * 		text:""
	 * 		alternatives:{
	 * 			id:int
	 * 			text:""}
	 * 		subtopic:foregin key
	 * }
	 * NB: Question id -1 is reserved as default answer
	 * 	Idea: Difficulty property per question?
	 */
	fetchData() {
		if (this.props.data !== undefined) {
			this.setState({
				title:this.props.data.title,
				questions:this.props.data.questions,
				number_of_questions:this.props.data.questions.length
			});
		}
		else {
			
			var host = '';
			if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
				host = 'http://localhost:8000';
			}
			else {
				host ='http://api.stelios.no';
			}
			
			var url = host
			
			var request = new Request({url});
		}
		/*test data*/
		
		var all_answers = [];
		
		for(var i=0; i<this.props.data.questions.length;i++) {
			all_answers[i]=-1;
		}
		
		this.setState({
			answers:all_answers
		});
	}
	/*Sends the result back to the server*/
	passData(){
		
	}
	
	/*Updates the answer*/
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
			
			var counter=-1;
			console.log("questions "+this.props.data.questions)
			return(
				<Container className="quizWrapper">
					<h1>the quiz is finished!</h1>
					{
						this.state.answers.map((answer)=>{
							counter++;
							return <div key={this.props.data.questions[counter].id}>Question: {this.props.data.questions[counter].id}Answer: {answer}</div>
						})
					}
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
	
	componentWillMount() {
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
		var styleQuestion= {
			witdth:'100%', 
			overflow:'auto', 
			position:'relative',
			borderTopStyle:'solid',
			borderTopColor:'#c5c5c5',
			paddingTop:'5px'
		}
		
		var styleText= {
			fontSize:'18px', 
			overflow:'hidden', 
			padding:'5px',
			marginBottom:'20px',
			lineHeight:'1.5',
			textAlign:'justify'
		}
		
		var styleNavButtons= {
			display:'flex',
			position:'relative',
			overflow:'hidden',
			cursor:'pointer',
			margin:'10px',
			marginTop:'20px'
		}
		
		var styleNavButtonPrev= {
			minHeight:'50px',
			backgroundColor:'#6c6c6c',
			color:'#ffffff',
			minWidth:'50%',
			position:'relative',
			display:'flex',
			alignItems:'center',
			borderRadius:'10px'
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
		
		var style3= {
			textAlign:'center',
			width:'100%',
			MozUserSelect:'none',
			WebkitUserSelect:'none',
			MsUserSelect:'none',
			UserSelect:'none'
		};
		
		/*chechs to see if any of the navbuttons needs adjustment for first/last*/
		/*Nice pale error red:#EF4E45*/
		var nextText='Next';
		if(this.state.lastQuestion===true) {
			nextText='Finish';
			styleNavButtonNext.backgroundColor='#5EBC43';
		}
		
		if(this.state.firstQuestion===true) {
			styleNavButtonPrev.backgroundColor='#e2e2e2';
		}
		else {
			styleNavButtonPrev.backgroundColor='#6c6c6c';
		}
		return (
			<div style={styleQuestion}>
				<div style={styleText}>
					{this.state.data["text"]}
				</div>
				{/*chosen:{this.state.chosenAnswer}*/}
				<div>
					{
					/*Consider whether to use text or id as key. 
					 * Chose whichever is unique/most likely to be*/
						this.state.data.alternatives.map((alternative)=> {
							return(<Answer 
									key={alternative.text}
									opNr={alternative.id}
									text={alternative.text}
									toggleCallback={this.changeToggle}
									curOn={this.state.chosenAnswer}/>)
						})
					}
					
					<div className="navButtons" style={styleNavButtons}>
						<button className="styleNavButtonPrev" style={styleNavButtonPrev} onClick={this.prevQuestion} disabled={this.state.firstQuestion}>
							<div style={style3}>Previous</div>
						</button>
						<button className="styleNavButtonNext" style={styleNavButtonNext} onClick={this.nextQuestion}>
							<div style={style3}>{nextText}</div>
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
		/*console.log("Handle change");*/
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
		
		const style1= {
			position:'relative',
			cursor:'pointer', 
			textAlign:'center', 
			backgroundColor:background,
			color:'#ffffff',
			minHeight:'50px',
			width:'100%',
			display:'flex',
			alignItems: 'center',
			borderColor:background,
			borderRadius:'10px',
			borderStyle:'none'
		}
		
		const style2= {
			textAlign:'center',
			fontSize:'15px',
			width:'100%',
			MozUserSelect:'none',
			WebkitUserSelect:'none',
			MsUserSelect:'none',
			UserSelect:'none',
		}
		
		const answerWrapper= {
			position:'relative',
			margin:'10px'
		}
		
		return (
			<div style={answerWrapper}>
				<button style={style1} onClick={this.handleChange}>
					<div style={style2}>
						Option {this.state.idNum}: {this.state.text}
					</div>
				</button>
			</div>
			)
	}
}
