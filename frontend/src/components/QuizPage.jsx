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
			inQuiz:true,
			quiz_data:[], 
			url_suffix:"quiz/data/1"
		};
		this.fetchData = this.fetchData.bind(this)
	}
	
	componentWillMount() {
		this.fetchData()
	}
	
	fetchData() {
		/*var url = this.state.url_suffix
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ url;
		} else {
			link = 'http://api.stelios.no/'+ url;
		}
		//generated request
		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});
		fetch(request).then((res) => {
			//console.log(res);
			return res.json();
		})
		.then((res) => {
			console.log("The fetched json data, right before it's put into state: " + res);
			this.setState({
				quiz_data:res
			});
		}).catch((e) => {console.log(e)});
		//console.log("data: " + data)
		*/
		
		
		const question1 = {
		id:4,
		text:"How and why the great badger of doom ended "+
			"the mayas has long been a hotly debated topic "+
			"in south american ancient history. What, however, "+
			"is today the most recognised theory?",
		alternatives:[
			{id:1, choice_text:"It ate them"},
			{id:2, choice_text:"It scared them to death"},
			{id:3, choice_text:"The adverse effect the badger had on local fauna"}
			],
		subtopic:'badgers',
		};
		
		const question2 = {
		id:7,
		text:"What is considered the most influential paper on tea and crackers?",
		alternatives:[
			{id:1, choice_text:"Objectivity in a subjective science, on the importance of peer review when doing taste tests"},
			{id:2, choice_text:"Air humidity and cracker elasticity"},
			{id:3, choice_text:"An unhealthy orthodoxy-on how black tea has been displaced by fruit tea"}
			],
		subtopic:'foodstuffs',
		};
		
		const question3 = {
		id:8,
		text:"Which data structure benefits greatly when implementations do so-called \"Robin Hooding\"?",
		alternatives:[
			{id:1, choice_text:"Priority Stack"},
			{id:2, choice_text:"Hash Map"},
			{id:3, choice_text:"Priority Queue"},
			{id:5, choice_text:"Red-Black Tree"}
			],
		subtopic:'Algorithms',
		};
		var all_questions = [question1, question2, question3];
		var data = {
			questions:all_questions,
			title:"This is a quiz from data passed through props"
		};
		this.setState({quiz_data:data});
		
	}
	
	render() {
		console.log("in render, the data in state is: " + this.state.quiz_data)
		if(this.state.inQuiz) {
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={16}>
							<Quiz data={this.state.quiz_data} refresh={this.fetchData}/>
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
							<div>{this.state.quiz_data.title}</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}
	}
}
