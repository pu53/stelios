import React from 'react';
import { getData } from '../../helpers.jsx';
import { Accordion, Icon, Button, List} from 'semantic-ui-react';
import { Link } from 'react-router'


/*A component listing links to all available quizes */
export class QuizList extends React.Component {
	constructor(props){
		super(props);

		this.state = {
			quizobject: {},
			reRender: false,
		};
	}

	componentWillMount(){
		this.getQuizList(); //starts the chain
	}


	/** method for getting the quizes from DB
	* return an object with
	* 	keys <- subjects
	* 	content <- quizes to subject
	*/
	getQuizList(){
		getData("quizsubjectname/",
			(() => {}),
			((res) => {
				const quizes = res;
				this.makeQuizObject(quizes);
			}),
			(() => {})
		);
	}

	makeQuizObject(quizes){
		var object = {};
		for (var i = 0; i < quizes.length; i++) {
			const quiz = quizes[i];
			var temp;
			if (!object.hasOwnProperty(quiz.name)) {
				temp = [];
				temp.push(quiz);
				object[quiz.name] = temp;
			}else{
				temp = object[quiz.name];
				temp.push(quiz);
			}
		}


		this.setState({
			quizobject: object,
		});
	}

	handleQuizClick(){
		this.setState({
			reRender: true,
		})
	}



	render(){
		console.log(this.state.quizobject);
		if(Object.keys(this.state.quizobject).length === 0){
			return <div>loading ... <br />
			or empty </div>;
		}else{
			const keys = Object.keys(this.state.quizobject);
			return <List>
				{
					// make an accordion from the quizobject
					// one identity
					keys.map((subject) => {
						const quizArray = this.state.quizobject[subject];
						return <Accordion key={subject}>
							<Accordion.Title>
								<Icon name='dropdown' /> <b>{subject} </b>
							</Accordion.Title>
							<Accordion.Content>
								<List bulleted>
									{
										quizArray.map((quiz) => {
											return <List.Item key={quiz.id}>
												<Link to={"/quiz/"+quiz.id.toString()} onClick={this.handleQuizClick}>
													{quiz.title}
												</Link>
											</List.Item>;
										})
									}
								</List>
							</Accordion.Content>
						</Accordion>
					})
				}
			</List>;
		}
	}
}
