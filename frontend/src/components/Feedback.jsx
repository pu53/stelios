
import React, { Component} from 'react';
import { Container, Grid, Button, Segment} from 'semantic-ui-react';
import { Quiz } from './Quiz';
import { getData } from '../helpers.jsx';

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
					subTopic: "basic",
					subTopicID: 0
				},
				{
					quiestionID: 1,
					questionText: "2-2",
					correct: true,
					subTopic: "basic",
					subTopicID: 0
				},
				{
					quiestionID: 2,
					questionText: "(2*2)-1",
					correct: true,
					subTopic: "advanced",
					subTopicID: 1
				},
				{
					quiestionID: 3,
					questionText: "2+2*(3-2)",
					correct: false,
					subTopic: "advanced",
					subTopicID: 1
				}
			]
		};
	} //end of constructor

	weakTopics(){
 		const answers = this.state.answers;
		var subtopics = {};
		// add all subtopics to the object
		for(var i=0;i<answers.length;i++){
			const subtopic = answers[i].subTopic;
			subtopics[subtopic]=[0,0];
		}

		// iterate over every answer, finding falsely answered questions
		for(var i=0;i<answers.length;i++){
			const subtopic = answers[i].subTopic
			const oldValue = subtopics[subtopic];
			if ( answers[i].correct ){
				oldValue[0] += 1;
			}
			oldValue[1] += 1;
			subtopics[subtopic] = oldValue;
		}

		console.log(subtopics);  // this is fine ^^
		// now, thesubtopics be like
		// {
		// 	subtopic: [x,y]
		// 	subtopic: [x,y]
		// 	....
		// }
		// x is correctm Y is total questions about subtopic.

		// weakTopics = [];

		// the limit for how picky we should be.
		// perhaps vary based on number of questons about subtopic?
		// TODO: that
		const limit = 0.8

		var weaktopics=[];

		for(var subtopic in subtopics){
		    // skip loop if the property is from prototype
		    if (!subtopics.hasOwnProperty(subtopic)) {
		    	continue;
		    }

			const correct=subtopics[subtopic][0];
			const total=subtopics[subtopic][1];

			if (correct/total < limit){
				weaktopics.push(subtopic);
			}
		}

		console.log(weaktopics);

	}	

	render(){
		this.weakTopics();
		return <h1>Top Kek </h1>;
	}
}