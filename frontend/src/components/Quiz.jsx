import React, { Component, PropTypes } from 'react';
import { Container, Grid } from 'semantic-ui-react';
import { SearchBar } from './SearchBar';

export class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			number_of_questions:0,
			number_of_right:0,
			number_of_wrong:0,
			currently_asking:0,
			subtopics:[]
			};
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
			<Grid>
			<Container style={{borderStyle:'solid', marginTop:'40px', padding:'0px'}}>
				<h1>This is a quiz</h1>
				<Question  style={{display:'inlineBlock'}}/>
			</Container>
			</Grid>
		);
	}
}

class Question extends Component {
	constructor(props) {
		super(props);
		this.state={chosen:0};
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange() {
		return("");
	}
	
	render() {
		return (
		<div>
			<Container text style={{display:'inlineBlock', overflowWrap:'breakWord', borderStyle:'solid'}}>
				Here comes the current question beeing asked, Lorem ipsum dolor 
				sit amet, consectetur adipiscing elit. Suspendisse id lobortis 
				tortor. Pellentesque sapien tortor, semper vehicula ipsum sed, 
				vehicula ullamcorper nunc. Nam in ante eget velit iaculis sodales.
				Sed tincidunt arcu tellus, pharetra eleifend mauris tincidunt non?
			</Container>
			<Container>
				
			</Container>
		</div>
		)
	}
}

class Answer extends Component {
	constructor(props) {
		super(props);
		this.state={chosen:0};
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	handleChange() {
		return("");
	}
	
	render() {
		return (
		<div>test</div>
		)
	}
}
