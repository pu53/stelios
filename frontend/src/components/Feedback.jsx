
import React, { Component} from 'react';
import { Container, Grid, Button, Segment, List, Divider} from 'semantic-ui-react';
import { Quiz } from './quiz/Quiz';
import { getData } from '../helpers.jsx'
var Markdown = require('react-remarkable');;

// Component for interpreting a Quiz-result and generate feedback
// Will be the more bot-like component
export class FeedbackContainer extends React.Component{
	constructor(props){
		super();
		//dummy variable for state.
		this.state={
			quizID: 0,
			quizname: "math 3.2",
			userID: "userID",
			user: "username",
			answers: [
				{
					quiestionID: 0,
					questionText: "2+2",
					correct: true,
					subTopic: "Iteration 1",
					subTopicID: 1
				},
				{
					quiestionID: 1,
					questionText: "2-2",
					correct: true,
					subTopic: "Iteration 1",
					subTopicID: 1
				},
				{
					quiestionID: 2,
					questionText: "(2*2)-1",
					correct: true,
					subTopic: "Iteration 2",
					subTopicID: 2
				},
				{
					quiestionID: 3,
					questionText: "2+2*(3-2)",
					correct: false,
					subTopic: "Iteration 2",
					subTopicID: 2
				},
				{
					quiestionID: 4,
					questionText: "2+2*(3-2)",
					correct: false,
					subTopic: "Iteration 3",
					subTopicID: 3
				},
				{
					quiestionID: 5,
					questionText: "2+2*(3-2)",
					correct: false,
					subTopic: "Iteration 3",
					subTopicID: 3
				}
			]
		};
	} //end of constructor


	/**
	* generates a list of weak topics based on the answers 
	* on the form [
	* 	{ID:id, Correct: %correct}, 
 	*	...
	* ]
	*
	*/

	weakTopics(){
 		const answers = this.state.answers;
		var subtopics = {};
		// add all subtopics to the object
		for(var i=0;i<answers.length;i++){
			const subtopicID = answers[i].subTopicID;
			subtopics[subtopicID]=[0,0];
		}

		// iterate over every answer, finding falsely answered questions
		for(var i=0;i<answers.length;i++){
			const subtopicID = answers[i].subTopicID
			const oldValue = subtopics[subtopicID];
			if ( answers[i].correct ){
				oldValue[0] += 1;
			}
			oldValue[1] += 1;
			subtopics[subtopicID] = oldValue;
		}

		// console.log(subtopics);  // this is fine ^^
		// now, thesubtopics be like
		// {
		// 	subtopicID: [x,y]
		// 	subtopicID: [x,y]
		// 	....
		// }
		// x is correctm Y is total questions about subtopicID.

		// weakTopics = [];

		// the limit for how picky we should be.
		// perhaps vary based on number of questons about subtopicID?
		// TODO: make the user choose difficulty
		const limit = 0.6

		var weaktopicsID=[];

		for(var subtopicID in subtopics){
		    // skip loop if the property is from prototype
		    if (!subtopics.hasOwnProperty(subtopicID)) {
		    	continue;
		    }

			const correct=subtopics[subtopicID][0];
			const total=subtopics[subtopicID][1];

			if (correct/total < limit){
				weaktopicsID.push({
					Correct: correct/total,
					ID: subtopicID
				});
			}
		}

		// console.log(weaktopicsID);
		// returns array sorted by correctness
		return weaktopicsID;

	}	

	render(){
		const weaktopics = this.weakTopics();
		return (<div>
			<h1>Topics you may want to read a bit about: <br /></h1>
			<List >
			{
				weaktopics.map((subtopic) => {
					return (
						<FeedbackSubTopic weaktopic={subtopic} />
					)
				}
			)}
			</List>
		</div>);
	}


}


class FeedbackSubTopic extends React.Component {
	constructor(props){
		super(props);
		this.state= {
			result: undefined,
			content: "",
			description: "",
			name: "",
			weaktopicID: this.props.weaktopic.ID,
			key: this.props.weaktopic.ID,
			weaktopicCorrect: this.props.weaktopic.Correct
		};
	}

	componentDidMount(){
		this.getWeakTopicsData();
	}

	/** get data from weaktopics assuming not empty list
	*	the list houd be the returned list from getWeakTopics, or following such patterns
	*	only method to communicate with DB
	*/
	getWeakTopicsData(){

		// console.log("subtopics/"+this.state.weaktopicID+"/");

		getData(
			"subtopics/"+this.state.weaktopicID+"/",
			(() => {}),
			((res) => {
				this.setState({
					result: res,
					name: res["name"],
					description: res["description"],
					content: res["content"]
				});
			}),
			(() => {})
			);
	}

	render(){
		return <Container style={{overflow: "hidden"}}>
			<Segment>
				<Grid>
					<Grid.Column width ={12}>
						<h2>{this.state.name}</h2>
					</Grid.Column>
					<Grid.Column width ={12}>
						<p><b>{this.state.description}</b></p>
					</Grid.Column>
					<Grid.Column width ={12}>
              			<Markdown source={this.state.content} />
					</Grid.Column>
				</Grid>
			</Segment>
			<br />
		</Container>;
	}
}
