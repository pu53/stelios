import React, { Component} from 'react';
import { Grid, Button, Segment } from 'semantic-ui-react';
import { Quiz } from './Quiz';
import { QuizList } from './QuizList.jsx';
import './quiz_page.css'
import { Template } from './Template'
import { CustomMessage } from './CustomMessage'
import { getData } from '../../helpers.jsx'

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
		let url = "quiz/data/"+this.props.params.quizId+"/"
		getData(url, 
				()=>{}, 
				(res)=>{this.setState({
					quizData:res
				}, this.finishLoad())},
				()=>{})
	}

	onNewClick = (e) => {
		e.preventDefault()
		this.setState({
		  quizState: "newQuiz"
		})
	}

	onChangeMessage = (status,message='',neg=false) => {
		//console.log("in onChangeMessage in quiz");
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
		this.forceUpdate()
	}

	render() {
		if(this.state.quizState === "inQuiz" && this.state.quizData.questions !== undefined) {
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
				<Segment raised style={{"paddingLeft":"40px", "paddingRight":"40px"}}>
					<Grid>
						<Grid.Column width={16}>
							<CustomMessage onChangeMessage={this.onChangeMessage} status={-1} message={this.state.message} neg={true} />
						</Grid.Column>
						<Grid.Row>
							<h1 className="test">Select a subject to view all avalible quizes</h1>
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
				</Segment>
			);
		}
	}
}
