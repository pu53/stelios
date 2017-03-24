
import React, { Component} from 'react';
import { Container, Grid, Button, Segment, List, Divider} from 'semantic-ui-react';
import { getData } from '../../helpers.jsx'
var Markdown = require('react-remarkable');;

// Component for interpreting a Quiz-result and generate feedback
// Will be the more bot-like component
export class FeedbackContainer extends React.Component{
	constructor(props){
		super();
		//dummy variable for state. should be passed as props
		this.state={
			quizID: 1,
			answers: [
				{
					quiestionID: 3, //props
					choice: 5, //props
					correct: false //standard value, change if wrong
				},
				{
					quiestionID: 5,
					choice: 10
				},
				{
					quiestionID: 9,
					choice: 15 
				},
				{
					quiestionID: 12,
					choice: 24
				}
			]
		};
	} //end of constructor

	/**
	* 	should correct answers passed by props
	*	look into database
	*	cross-reference with questionID-correctanswerto
	*
	*
	*/

	correct(){
		var answers = this.state.answers;

		for (var i = 0; i < answers.length; i++) {
			var answer=answers[i];
			const choice = answer.choice;
			const questionID = answer.questionID;

			getData("choice/"+choice.toString()+"/",
				(() => {}),
				((res) => {
					console.log(res);
					if(res.question == questionID){
						answers[i] = {
							questionID: questionID,
							choice: choice,
							correct: true //only change
						};
					}
				}),
				(() => {})
			);
		}
	}

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

/**
Component for the topics the user hsould look into. 
gets data from the database her
@props: weaktopic {ID, Correct} from weaktopics from feedbackcontainer
*/

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