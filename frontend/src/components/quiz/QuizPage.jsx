import React, { Component} from 'react';
import { Container, Grid, Button, Segment} from 'semantic-ui-react';
import { SearchBar } from '../SearchBar';
import { Quiz } from './Quiz';
import { QuizList } from './QuizList.jsx';
import { getData } from '../../helpers.jsx';
import '../../styles/quiz_page.css';
import './quiz_page.css'
import { Template } from './Template'
import { CustomMessage } from './CustomMessage'

export class QuizPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inQuiz:false,
			quizData:[],
			quizState: "none", //state variable to select state of quiz. none, inQuiz and newQuiz are avalible options.
			url_suffix:"quiz/data/1/",

			status: -1, //things for custom message
			message: "",
			neg: false
		};
		this.fetchData = this.fetchData.bind(this)
		this.done_loading = false
	}
	
	componentWillMount() {
		this.fetchData()
	}
  newQuizData = (quiz_data) => {
    this.setState({
    })
      quiz_data
  }
	fetchData() {
		var url = this.state.url_suffix
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ url;
		} else {
			link = 'http://api.stelios.no/'+ url;
		}
		
		link += this.props.params.quizId;
		
		//generated request
		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});
		
		fetch(request).then((res) => {
			console.log("Status: "+ res.status)
			return res.json();
		})
		.then((res) => {
			console.log("found data: " + res);
			console.log(res.questions[1].text)
			this.setState({
				quizData:res
			}, this.finishLoad())
		}).catch((e) => {
			console.log(e);
		});
	
		
		
		/*
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
		*/
	}
	onNewClick = (e) => {
		e.preventDefault()
		this.setState({
		  quizState: "newQuiz"
		})
	}

	onChangeMessage = (status,message='',neg=false) => {
		console.log("in onChangeMessage in quiz");
		this.setState({
			status,message,neg
		})
	}

	changeQuizState = (quizState) => {
		this.setState({
			quizState
		})
	}
	
	finishLoad() {
		this.done_loading = true;
		console.log("Load done, and the data is: " + this.state.quiz_data)
		this.forceUpdate()
	}
	
	render() {
		console.log("in render, the data in state is: " + this.state.quizData.questions !== undefined);
		if(this.state.quizState === "inQuiz" && this.state.quizData) {
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={16}>
							<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
						</Grid.Column>
						<Grid.Column width={16}>
							<Quiz data={this.state.quiz_data} refresh={this.fetchData}/>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}
    else if (this.state.quizState === "newQuiz") {
      return (
        <Grid>
					<Grid.Column width={16}>
						<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
					</Grid.Column>
          <Grid.Column width={16}>
            <Template
              new={true}
              newQuizData={this.newQuizData}
              quizData={this.state.quizData}
							onChangeMessage={this.onChangeMessage}
							changeQuizState={this.changeQuizState}
              />
          </Grid.Column>

        </Grid>
      )
    }
		else {
			return(
				<Grid>
					<Grid.Column width={16}>
						<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
					</Grid.Column>
					<Grid.Row>
						<h1 className="test">This is the quiz page</h1>
					</Grid.Row>
					
					<Grid.Row>
						<Grid.Column width={4}>
							<Button content="New quiz" onClick={this.onNewClick} />
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<QuizList />
					</Grid.Row>
				</Grid>
			);
		}
	}
}
