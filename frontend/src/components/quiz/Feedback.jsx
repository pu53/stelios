
import React from 'react';
import { Container, Grid, Segment, List} from 'semantic-ui-react';
import { getData } from '../../helpers.jsx'
var Markdown = require('react-remarkable');;

// Component for interpreting a Quiz-result and generate feedback
// Will be the more bot-like component
export class FeedbackContainer extends React.Component{
	constructor(props){
		super();
		//dummy variable for state. should be passed as props
		this.state={
			answers: props.answers,
			subtopics: props.subtopics,
			subtopicTrueTotal: {},
			isTrue: [],
			weaktopicsID: [],
			render: false,
		};
		console.log(this.state);
	} //end of constructor


	componentDidMount(){
		this.getIsTrue();
	}

	componentDidUpdate(){
		if(this.state.isTrue.length === this.state.answers.length &&
			Object.keys(this.state.subtopicTrueTotal).length === 0){
			console.log("time to calculate");
			this.CalcTrueTotal();
		}
		if(Object.keys(this.state.subtopicTrueTotal).length > 0 &&
			this.state.render === false){
			console.log("time to judge");
			this.weakTopics();
		}
	}

	getIsTrue(){
		const answers = this.state.answers;
 		const subtopics = this.state.subtopics;


		// iterate over every answer, finding falsely answered questions
		for (var i = 0; i < answers.length; i++) {

			// gets from DB if the answer is marked as true
			if(answers[i] !== -1 && answers[i] !== undefined){
				// isTrue = this.getIsTrue(answers[i]);
				getData("choice/istrue/"+answers[i].toString(),
					(()=>{}),
					((res) => {
						// this.state.isTrue.push(res.is_correct);
						var isTrue = this.state.isTrue;
						isTrue.push(res.is_correct);
						this.setState({
							isTrue: isTrue,
						})
						console.log(this.state.isTrue);
					}),
					(()=>{}));
			}
		}
	}

	CalcTrueTotal(){
 		const subtopics = this.state.subtopics;
 		const isTrue = this.state.isTrue;

 		var subtopicObject = {}
 		for (var i = 0; i < isTrue.length; i++) {
			for (var j = 0; j < subtopics[i].length; j++) {
				subtopicObject[subtopics[i][j]]=[0,0];
			}
		}


		for (var i = 0; i < isTrue.length; i++) {
			for (var j = 0; j < subtopics[i].length; j++) {
				const oldvalue=subtopicObject[subtopics[i][j]];

				var newvalue = oldvalue;
				console.log(isTrue[i]);
				if(isTrue[i]){
					newvalue[0]+=1;
				}
				newvalue[1]+=1;

				subtopicObject[subtopics[i][j]]=newvalue;

			}
		}
		console.log(subtopicObject);  // this is fine ^^
		// now, thesubtopics be like
		// {
		// 	subtopicID: [x,y]
		// 	subtopicID: [x,y]
		// 	....
		// }
		// x is correctm Y is total questions about subtopicID.

		this.setState({
			subtopicTrueTotal: subtopicObject,
		});
		console.log("subtopicTrueTotal set");
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
 		const subtopics = this.state.subtopics;
 		const subtopicObject = this.state.subtopicTrueTotal;


		// weakTopics = [];

		// the limit for how picky we should be.
		// perhaps vary based on number of questons about subtopicID?
		// TODO: make the user choose difficulty
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

		// console.log(weaktopicsID);
		// returns array sorted by correctness
		this.setState({
			weaktopicsID: weaktopicsID,
			render: true,
		})
		// return weaktopicsID;

	}	
	
	render(){
		// console.log(this.state.weaktopicsID);
		if(this.state.render){
			const weaktopics = this.state.weaktopicsID;
			return (<div>
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
			return <h1>loading ... .. . </h1>;
		}
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
					<Grid.Column width={12}>
						<h2>{this.state.name}</h2>
					</Grid.Column>
					<Grid.Column width={12}>
						<p><b>{this.state.description}</b></p>
					</Grid.Column>
					<Grid.Column width={12}>
              			<Markdown source={this.state.content} />
					</Grid.Column>
				</Grid>
			</Segment>
			<br />
		</Container>;
	}
}
