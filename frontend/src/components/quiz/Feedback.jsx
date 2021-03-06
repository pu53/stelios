import React from 'react';
import { Container, Grid, Segment, List, Accordion, Icon} from 'semantic-ui-react';
import { getData } from '../../helpers.jsx'
var Markdown = require('react-remarkable');;

// Component for interpreting a Quiz-result and generate feedback
// Will be the more bot-like component
export class FeedbackContainer extends React.Component{
	constructor(props){
		super();
		console.log(props);
		this.state={
			answers: props.answers,
			subtopics: props.subtopics,
			subtopicTrueTotal: {},
			isTrue: [],
			weaktopicsID: [],
			render: false,
		};
	} //end of constructor


	componentDidMount(){
		this.getIsTrue();
	}

	/**
	*	updates state.isTrue with an array with true/false
	*	dependant on wheter the answer was true or not
	*	the index in this array will be same index for question
	*/

	getIsTrue(){
		const answers = this.props.answers;
 		const quizid = this.props.quizid;

 		getData('quiz/true/'+quizid.toString(),
 			(() => {}),
 			((res) => {
 				const correct = res.correct;

 				var isTrue = []

 				for (var i = 0; i < correct.length; i++) {
 					if(correct[i] === answers[i]){
 						isTrue.push(true);
 					}else{
 						isTrue.push(false);
 					}
 				}
 				this.CalcTrueTotal(isTrue);
 			}),
 			(() => {})
 		);
	}

	/**
	*	Method for creating the object with [correct, total] array
	*	per question in a dict with
	* generates a list of weak topics based on the answers
	* on the form [
	* 	{ID:id, Correct: %correct},
 	*	...
	* ]
	*
	*/


	CalcTrueTotal(isTrue){
 		const subtopics = this.state.subtopics;

 		// creates empty dict
 		var subtopicObject = {}
 		for (var i = 0; i < isTrue.length; i++) {
			for (var j = 0; j < subtopics[i].length; j++) {
				subtopicObject[subtopics[i][j]]=[0,0];
			}
		}

		// updates the dict with the datas from state.isTrue
		for (var i = 0; i < isTrue.length; i++) {
			for (var j = 0; j < subtopics[i].length; j++) {
				const oldvalue=subtopicObject[subtopics[i][j]];

				let newvalue = oldvalue;
				if(isTrue[i]){
					newvalue[0]+=1;
				}
				newvalue[1]+=1;

				subtopicObject[subtopics[i][j]]=newvalue;

			}
		}

		this.weakTopics(subtopicObject, isTrue);
	}


	/**
	* generates a list of weak topics based on the answers
	* on the form [
	* 	{ID:id, Correct: %correct},
 	*	...
	* ]
	*/
	weakTopics(subtopicObject, isTrue){
 		const answers = this.state.answers;
 		const subtopics = this.state.subtopics;
 		// const subtopicObject = this.state.subtopicTrueTotal;

		// the limit for how picky we should be.
		// perhaps vary based on number of questons about subtopicID?
		const limit = 0.6

		var weaktopicsID=[];

		for(var subtopicID in subtopicObject){
		    // skip loop if the property is from prototype
		    if (!subtopicObject.hasOwnProperty(subtopicID)) {
		    	continue;
		    }

			const correct=subtopicObject[subtopicID][0];
			const total=subtopicObject[subtopicID][1];

			if (correct/total < limit){
				weaktopicsID.push({
					Correct: correct/total,
					ID: subtopicID
				});
			}
		}
		// returns array sorted by correctness
		this.setState({
			isTrue: isTrue,
			weaktopicsID: weaktopicsID,
			render: true,
		})
	}

	getQuestionResult(){
		const isTrue = this.state.isTrue;

		var i=1;
		return(
		<Segment>
			<Accordion>
				<Accordion.Title>
					<h1>Result from quiz<Icon name="dropdown" /></h1>
				</Accordion.Title>
				<Accordion.Content>
				<List bulleted>
					{
						isTrue.map((answer) => {
							return <List.Item>
								Question {i++}: {answer ? "Correct" : "Wrong"}
							</List.Item>
						})
					}
				</List>
				</Accordion.Content>
			</Accordion>
		</Segment>
		);
	}

	render(){
		if(this.state.render){
			const weaktopics = this.state.weaktopicsID;
			if(Object.keys(weaktopics).length > 0){
				return (<div>
					{this.getQuestionResult()}
					<h1>Topics you may want to read a bit about: <br /></h1>
					<List >
					{
						weaktopics.map((subtopic) => {
							return (
								<FeedbackSubTopic weaktopic={subtopic} key={subtopic.ID}/>
							)
						}
					)}
					</List>
				</div>);
			}else{
				return <h1>
					Well Done! You have a good understanding of all topics covered by the quiz.
					{this.getQuestionResult()}
				</h1>;
			}
		}else{
			return <h1>loading ... .. . </h1>;
		}
	}
}

/**
Component for the topics the user should look into.
gets data from the database here
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
				<Accordion>
					<Accordion.Title>
						<h2><Icon name="dropdown" /> {this.state.name} - you got {this.props.weaktopic.Correct * 100}% of questions about this topic correct</h2>
						<p><b>{this.state.description}</b></p>
					</Accordion.Title>
					<Accordion.Content>
						<Markdown source={this.state.content} />
					</Accordion.Content>
				</Accordion>
			</Segment>
			<br />
		</Container>;
	}
}