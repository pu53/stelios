import React, { Component} from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';
import { SearchBar } from './SearchBar';

/**TODO: Make nav buttons stay in the same place?
 * TODO: Quiz generation
 * TODO: Scramble order of alternatives
 * TODO: Show earlier answers via toggle
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
			number_of_right:0,
			number_of_wrong:0,
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
	 * 		correct:int
	 * }
	 * NB: Question id -1 is reserved as default answer
	 * 	Idea: Difficulty property per question?
	 */
	fetchData() {
		var host = '';
		if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			host = 'http://localhost:8000';
		}
		else {
			host ='http://api.stelios.no';
		}
		
		var url = host
		
		var request = new Request({url});
		
		/*test data*/
		const question1 = {
		text:"How and why the great badger of doom ended "+
			"the mayas has long been a hotly debated topic "+
			"in south american ancient history. What, however, "+
			"is today the most recognised theory?",
		alternatives:[
			{id:1, text:"It ate them"},
			{id:2, text:"It scared them to death"},
			{id:3, text:"The adverse effect the badger had on local fauna"}
			],
		correct:3,
		subtopic:'badgers'
		};
		
		const question2 = {
		text:"What is considered the most influential paper on tea and crackers?",
		alternatives:[
			{id:1, text:"Objectivity in a subjective science, on the importance of peer review when doing taste tests"},
			{id:2, text:"Air humidity and cracker elasticity"},
			{id:3, text:"An unhealthy orthodoxy-on how black tea has been displaced by fruit tea"}
			],
		correct:1,
		subtopic:'foodstuffs'
		};
		
		const question3 = {
		text:"Which data structure benefits greatly when implementations do so-called \"Robin Hooding\"?",
		alternatives:[
			{id:1, text:"Priority Stack"},
			{id:2, text:"Hash Map"},
			{id:3, text:"Priority Queue"},
			{id:5, text:"Red-Black Tree"}
			],
		correct:2,
		subtopic:'Algorithms'
		};
		const all_questions = [question1, question2, question3];
		const all_answers = [];
		
		for(var i=0; i<all_questions.length;i++) {
			all_answers[i]=-1;
		}
		
		this.setState({
			questions:all_questions, 
			number_of_questions:all_questions.length,
			answers:all_answers
		});
		
		console.log(this.state.questions)
	}
	
	changeQuestion(increment, chosenAlternative) {
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
			
			console.log("Ought to record answer " + chosenAlternative + 
				" for " + this.state.currently_asking);
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
		var styleTopInfo= {
			display:'flex',
			margin:'5px',
			fontSize:'20px',
			overflow:'auto',
			position:'relative',
			paddingBottom:'5px'
		}
		
		var styleContainer= {
			overflow:'auto',
			borderStyle:'dashed',
			position:'relative',
		}
		
		
		if(this.state.finished===false) {
			return (
			<Container style={styleContainer}>
				<div style={styleTopInfo}>
					<div style={{width:'50%'}}>
						{this.state.currently_asking}/{this.state.number_of_questions}
					</div>
					<div style={{width:'50%', textAlign:'right'}}>
						{this.state.questions[this.state.currently_asking-1].subtopic}
					</div>
				</div>
				
				<h1 style={{textAlign:'center'}}>
					{this.state.title}
				</h1>
				
				<div>
					<Question 
						data={this.state.questions[this.state.currently_asking-1]}
						onChange={this.changeQuestion}
						firstQuestion={this.state.currently_asking === 1}
						lastQuestion={this.state.currently_asking === this.state.number_of_questions}
						chosen={this.state.answers[this.state.currently_asking-1]}/>
				</div>
			</Container>
		);
		}
		else {
			return(
				<Container style={styleContainer}>
					<h1>the quiz is finished!</h1>
					{this.state.answers[0]}
					{this.state.answers[1]}
					{this.state.answers[2]}
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
			chosen:-1,
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
				chosen:this.props.chosen
			});
		}
	}
	
	changeToggle(id) {
		/*console.log("Callback from" + id);*/
		if(id === this.state.chosen) {
			this.setState({chosen:-1});
		}
		else {
			this.setState({chosen:id});
		}
	}
	
	nextQuestion() {
		console.log("internaly chosen: " + this.state.chosen);
		this.props.onChange(1,this.state.chosen);
	}
	
	prevQuestion() {
		console.log("internaly chosen: " + this.state.chosen);
		this.props.onChange(-1, this.state.chosen);
	}
	
	componentWillReceiveProps(nextProps) {
		this.setState({
			data:nextProps.data,
			firstQuestion:nextProps.firstQuestion,
			lastQuestion:nextProps.lastQuestion,
			chosen:nextProps.chosen
		});
		this.changeToggle();
	}
	
	render() {
		/*defining styles within render like this is probably not great
		 * but for the first draft it's ok*/
		var styleQuestion= {
			witdth:'100%', 
			borderStyle:'dotted', 
			overflow:'auto', 
			position:'relative',
			marginLeft:'10%', 
			marginRight:'10%', 
			minWidth:'80%',
		}
		
		var styleText= {
			fontSize:'18px', 
			overflow:'hidden', 
			padding:'5px',
			marginBottom:'20px',
			lineHeight:'1.5',
		}
		
		var styleNavButtons= {
			display:'flex',
			position:'relative',
			overflow:'hidden',
			cursor:'pointer',
			margin:'10px',
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
		var nextText='Next';
		if(this.state.lastQuestion===true) {
			nextText='Finish';
			styleNavButtonNext.backgroundColor='#EF4E45';
		}
		
		if(this.state.firstQuestion===true) {
			styleNavButtonPrev.backgroundColor='#efefef';
		}
		else {
			styleNavButtonPrev.backgroundColor='#6c6c6c';
		}
		return (
			<div style={styleQuestion}>
				<div style={styleText}>
					{this.state.data["text"]}
				</div>
				chosen:{this.state.chosen}
				<div style={{borderStyle:'solid'}}>
					{
					/*Consider whether to use text or id as key. 
					 * Chose whichever is unique/most likely to be*/
						this.state.data.alternatives.map((alternative)=> {
							return(<Answer 
									key={alternative.text}
									opNr={alternative.id}
									text={alternative.text}
									toggleCallback={this.changeToggle}
									curOn={this.state.chosen}/>)
						})
					}
					
					<div style={styleNavButtons}>
						<button style={styleNavButtonPrev} onClick={this.prevQuestion} disabled={this.state.firstQuestion}>
							<div style={style3}>Previous</div>
						</button>
						<button style={styleNavButtonNext} onClick={this.nextQuestion}>
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
	
	componentWillReceiveProps(nextProps) {
		console.log("Will receive props!");
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
