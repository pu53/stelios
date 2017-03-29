import React, { Component} from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { Quiz } from './Quiz';
import { QuizList } from './QuizList.jsx';
import './quiz_page.css'
import { Template } from './Template'
import { CustomMessage } from './CustomMessage'

export class QuizPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quizData:[],
			quizState: "inQuiz", //state variable to select state of quiz. none, inQuiz and newQuiz are avalible options.
			url_suffix:"quiz/data/",

			status: -1, //things for custom message
			message: "",
			neg: false
		};
		this.fetchData = this.fetchData.bind(this)
	}
	
	componentWillMount() {
		this.fetchData()
	}
	 newQuizData = (quiz_data) => {
		this.setState({
			quiz_data
		})
	}
	fetchData() {
		var suffix = this.state.url_suffix
		var link = '';
		//Constructing request link, by choosing enviroment
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/';
		} else {
			link = 'http://api.stelios.no/';
		}
		
		//Adding suffix and parameter to the link path, completing it
		link += suffix + this.props.params.quizId;
		
		//Generate request
		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});
		
		//Fetch data
		fetch(request).then((res) => {
			//console.log("Status: "+ res.status)
			return res.json();
		})
		.then((res) => {
			//console.log("found data: " + res);
			this.setState({
				quizData:res
			}, this.finishLoad())
		}).catch((e) => {
			console.log(e);
		});
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
		console.log("Load done, and the data is: " + this.state.quizData)
		this.forceUpdate()
	}
	
	render() {
		if(this.state.quizState === "inQuiz" && this.state.quizData.questions !== undefined) {
			console.log("in render, the data in state is: ");
		
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={16}>
							<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
						</Grid.Column>
						<Grid.Column width={16}>
							<Quiz data={this.state.quizData} refresh={this.fetchData}/>
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
