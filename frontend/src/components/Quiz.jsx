import React, { Component, PropTypes } from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';
import { SearchBar } from './SearchBar';

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
		this.state = {
			number_of_questions:0,
			number_of_right:0,
			number_of_wrong:0,
			currently_asking:0,
			questions:[]
			};
	}
	
	componentDidMount() {
		this.fetchData()
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
	 * 		questions:[] #might as well implement support for random bonus questions
	 *  }
	 * 
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
		
		return("");
	}
	
	render() {
		/*TODO: Generates title if no title is specified*/
		return(
			<Container style={{overflow:'auto', borderStyle:'dashed', position:'relative', minWidth:'100%'}}>
				<h1 style={{textAlign:'center'}}>
				{'This is a quiz in '.concat('testTopic')}
				</h1>
				<Question data={{text:"How and why the great badger of doom ended the mayas has long been a hotly debated topic in south american ancient history. What, however, is today the most recognised theory?"}}/>
			</Container>
		);
	}
}

/*Representing a single question in a quiz. Manages the answer selection*/
class Question extends Component {
	constructor(props) {
		super(props);
		this.state= {
			chosen:0
			};
		
		this.handleChange = this.handleChange.bind(this);
		this.changeToggle = this.changeToggle.bind(this);
	}
	
	handleChange(e) {
		return("");
	}
	
	changeToggle(id) {
		/*console.log("Callback from" + id);*/
		this.setState({chosen:id});
	}
	
	render() {
		/*console.log("Render Question!");*/
		return (
			<div style={{marginLeft:'15%', marginRight:'15%', width:'70%', borderStyle:'dotted', overflow:'hidden', position:'relative'}}>
				<div style={{fontSize:'20px', overflow:'hidden', padding:'5px'}}>
					{this.props.data["text"]}
				</div>
				<div>
					<Answer opNr={1} toggleCallback={this.changeToggle} curOn={this.state.chosen}/>
					<Answer opNr={2} toggleCallback={this.changeToggle} curOn={this.state.chosen}/>
					<Answer opNr={3} toggleCallback={this.changeToggle} curOn={this.state.chosen}/>
					<Answer opNr={4} toggleCallback={this.changeToggle} curOn={this.state.chosen}/>
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
		this.state={
			toggeled:false,
			idNum:parseInt(this.props.opNr),
			text:""
			};
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange() {
		this.props.toggleCallback(this.state.idNum);
		/*console.log("Handle change");*/
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
			background='#00ff11';
		}
		else {
			background='#68B1FF';
		}
		
		const style1={
			position:'relative',
			cursor:'pointer', 
			textAlign:'center', 
			backgroundColor:background,
			color:'#ffffff',
			minHeight:'50px',
			display:'flex',
			alignItems: 'center'
		}
		
		const style2={
			textAlign:'center',
			width:'100%',
			MozUserSelect:'none',
			WebkitUserSelect:'none',
			MsUserSelect:'none',
			UserSelect:'none'
		}
		
		return (
			<div style={style1} onClick={this.handleChange}>
				<div style={style2}>
					Option {this.state.idNum}, currently chosen: {this.props.curOn}
				</div>
			</div>
			)
	}
}
