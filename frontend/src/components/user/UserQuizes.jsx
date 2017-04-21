import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Label, Header, Icon } from 'semantic-ui-react'

export class UserQuizes extends React.Component {
    constructor(props) {
		super(props);
	}

    /* Creates a list of links to a users quizes */
    render() {
        return (
            <div>
            <br />
            <Header size='large'>Quizes</Header>
                <Menu fluid vertical>
                   {this.props.quizes.map(function(quiz, index){
                       return <NavLink to={'/quiz/'+quiz.id} key={index}><Menu.Item ><Icon name='tasks' /> <Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item></NavLink>;
                     })}
                </Menu>
           </div>
        );
    }
}
