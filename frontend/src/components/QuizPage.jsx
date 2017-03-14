import React, { Component} from 'react';
import { Container, Grid, Button, Segment} from 'semantic-ui-react';
import { SearchBar } from './SearchBar';
import { Quiz } from './Quiz';
import { getData } from '../helpers.jsx';
import '../styles/quiz_page.css'

export class QuizPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inQuiz:false,
			quizData:[]
		};
	}
	
	componentWillMount() {
		this.fetchData()
	}
	
	fetchData() {
		
		
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
		subtopic:'badgers',
		correctID:1
		};
		
		const question2 = {
		text:"What is considered the most influential paper on tea and crackers?",
		alternatives:[
			{id:1, text:"Objectivity in a subjective science, on the importance of peer review when doing taste tests"},
			{id:2, text:"Air humidity and cracker elasticity"},
			{id:3, text:"An unhealthy orthodoxy-on how black tea has been displaced by fruit tea"}
			],
		subtopic:'foodstuffs',
		correctID:1
		};
		
		const question3 = {
		text:"Which data structure benefits greatly when implementations do so-called \"Robin Hooding\"?",
		alternatives:[
			{id:1, text:"Priority Stack"},
			{id:2, text:"Hash Map"},
			{id:3, text:"Priority Queue"},
			{id:5, text:"Red-Black Tree"}
			],
		subtopic:'Algorithms',
		correctID:2
		};
		var all_questions = [question1, question2, question3];
		var data = {
			questions:all_questions,
			title:"This is a quiz from data passed through props"
		};
		this.setState({quizData:data});
	}
	
	render() {
		
		if(this.state.inQuiz) {
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={16}>
							<Quiz data={this.state.quizData}/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}
		else {
			return(
				<Grid>
					<Grid.Row>
						<h1 className="test">This is the quiz page</h1>
					</Grid.Row>
					
					<Grid.Row>
						<Grid.Column width={4}>
							<div></div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}
	}
}
