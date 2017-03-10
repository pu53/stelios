import React, { Component, PropTypes } from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';
import { SearchBar } from './SearchBar';

/*The head element of a quiz. Fetches all the data for all the quiestions included
 * in the quiz and passes them on to the subcomponents when needed*/
export class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			number_of_questions:0,
			number_of_right:0,
			number_of_wrong:0,
			currently_asking:0,
			questions:[]
			};
			
		this.setState({questions:{hilsen:'hei', utrop:'ånei!'}})
	}
	
	componentDidMount() {
		this.fetchData()
	}
	
	fetchData() {
		var host = '';
		if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			host = 'http://localhost:8000';
		}
		else {
			host ='http://api.stelios.no';
		}
		
		var url = host
		
		var Request = new Request({url});
		
		return("");
	}
	
	render() {
		
		return(
			<Container style={{overflow:'auto', borderStyle:'dashed', position:'relative', minWidth:'100%'}}>
				<h1 style={{textAlign:'center'}}>
				{'This is a quiz in '.concat('testTopic')}
				</h1>
				<Question/>
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
	}
	
	handleChange() {
		return("");
	}
	
	render() {
		return (
			<div style={{marginLeft:'15%', marginRight:'15%', width:'70%', borderStyle:'dotted', overflow:'hidden', position:'relative'}}>
				<div text style={{fontSize:'20', overflow:'hidden', padding:'5px'}}>
					How and why the great badger of doom ended the mayas has long been a hotly debated topic
					in south american ancient history. What, however, is today the most recognised theory?
				</div>
				<Answer opNr={1}/>
				<Answer opNr={2}/>
				<Answer opNr={3}/>
				<Answer opNr={4}/>
			</div>
		)
	}
}
/*A simle custom button for presenting an answer option. What option is toggled is
 * monitored from the Question owning the answer*/
class Answer extends Component {
	constructor(props) {
		super(props);
		this.state={
			chosen:0,
			idNum:parseInt(this.props.opNr)
			};
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange() {
		var num = this.state.idNum;
		this.setState({idNum:num+1});
	}
	
	render() {
		return (
		<div style={{cursor:'pointer', textAlign:'center'}} onClick={this.handleChange}>
			Option {this.state.idNum}
		</div>
		)
	}
}


