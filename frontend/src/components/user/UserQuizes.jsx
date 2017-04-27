import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Label, Header, Icon, Grid } from 'semantic-ui-react'

export class UserQuizes extends React.Component {
	constructor(props) {
		super(props);
	}

	/* Creates a list of links to a users quizes */
	render() {
		/*Checks if the current user is a professor, and shows/hides the stats
		 * button accordingly */
		return (
			<div>
			<br />
			<Header size='large'>Quizes</Header>
				{localStorage.getItem('stelios_current_user_professor')==='true'?
					<Menu fluid vertical>
					{this.props.quizes.map(function(quiz, index){
						return <div key={index}>
							<Grid><Grid.Row>
							{/*First comes the quiz link*/}
							<Grid.Column width={12}><NavLink to={'/quiz/'+quiz.id} key={index}><Menu.Item><Icon name='tasks' /><Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item></NavLink></Grid.Column>
							{/*Then the statistics link*/}
							<Grid.Column width={4}><NavLink to={"/stat/quiz/"+quiz.id}><div style={{ 'height':'100%', 'borderLeft':'solid','borderWidth':'2px','borderColor':'#666666','display':'flex', 'alignItems':'center','color':'black', 'justifyContent':'center'}}>Statistics</div></NavLink></Grid.Column>
							</Grid.Row></Grid>
						</div>;
						})}
				</Menu>
				:<Menu fluid vertical>
					{this.props.quizes.map(function(quiz, index){
						return <NavLink to={'/quiz/'+quiz.id} key={index}> <Menu.Item> <Icon name='tasks' /> <Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item></NavLink>;
					})}
				</Menu>
				}
			</div>
		);
	}
}
