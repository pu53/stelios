import React, { Component} from 'react';
// import { Container, Grid, Button, Segment, List, Divider} from 'semantic-ui-react';
import { getData } from '../../helpers.jsx';
import { Accordion, Icon} from 'semantic-ui-react';


/** Class for 
* 	listing quizes
*
*
*/

export class QuizList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
		};
	}

	componentWillMount(){
		this.getQuizList();
	}

	/** method for getting the quizes from DB
	* return an object with 
	* 	keys <- subjects
	* 	content <- quizes to subject
	*/ 
	getQuizList(){

		var quizes = [];

		getData("quiz/",
			(() => {}),
			((res) => {
				quizes = res;
				console.log(res);
			}),
			(() => {})
		);

		var quizBySubject = {};

		console.log(quizes);
		for (var i = 0; i < quizes.length; i++) {

			const oldValue = quizBySubject[quizes[i].subject];
			console.log(oldValue);
			// quizBySubject[quiz.subject] 
		}
		this.setState({
			quizobject: quizes,
		});

	}

	render(){
		return <Accordion>
			<Accordion.Title>
	      		<Icon name='dropdown' />
	      		Quizes!
	    	</Accordion.Title>
	    	<Accordion.Content>
	    		<p>
	    			{
	    				this.state.quizobject //atm empty
	    			} 
	    		</p>
	    	</Accordion.Content>
	    </Accordion>;
	}
}