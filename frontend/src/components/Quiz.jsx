import React, { Component, PropTypes } from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';
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
			
		this.setState({subtopics:['hei', 'hallo', 'heisann']})
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
			<Grid style={{borderStyle:'solid', marginTop:'40px', padding:'0px'}}>
				<Grid.Row>
					<Grid.Column style={{borderStyle:'dashed'}}> {
						<h1 style={{textAlign:'center'}}>
						{'This is a quiz in '.concat('testTopic')}
						</h1>
					}
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Question/>
				</Grid.Row>
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
		<Grid style={{borderStyle:'solid'}}>
			<Grid.Row><Container style={{borderStyle:'solid'}}>
				Here comes the current question beeing asked, Lorem ipsum dolor 
				sit amet, consectetur adipiscing elit. Suspendisse id lobortis 
				tortor. Pellentesque sapien tortor, semper vehicula ipsum sed, 
				vehicula ullamcorper nunc. Nam in ante eget velit iaculis sodales.
				Sed tincidunt arcu tellus, pharetra eleifend mauris tincidunt non?
			</Container></Grid.Row>
			<Grid.Row centered style={{borderStyle:'dotted'}}><Container>
				<Grid.Row style={{borderStyle:'dashed', width:'100%',margin:'auto'}}>
					<Answer opNr="1"/>
				</Grid.Row>
				<Grid.Row><Answer opNr="2"/></Grid.Row>
				<Grid.Row><Answer opNr="3"/></Grid.Row>
				<Grid.Row><Answer opNr="4"/></Grid.Row>
			</Container></Grid.Row>
		</Grid>
		)
	}
}

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
		<Button onClick={this.handleChange}>Option {this.state.idNum}</Button>
		)
	}
}


