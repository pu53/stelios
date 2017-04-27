import React from 'react'
import { Link } from 'react-router';
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
                    return(
                        <div>
                        {localStorage.getItem('stelios_current_user_professor')==='true'?
                        //If the user is a professor the quiz list will have links to statistics
                        <Link to={'/quiz/'+quiz.id} key={index}><Menu.Item ><Icon name='tasks' /> <Label color='teal'><Link to={'/stat/quiz/'+quiz.id}>Statistics</Link></Label>{ quiz.title }</Menu.Item></Link>
                        :
                        //otherwise the list will only show links to do the quizes
                        <Link to={'/quiz/'+quiz.id} key={index}><Menu.Item ><Icon name='tasks' /> <Label color='teal'>{quiz.deadline}</Label>{ quiz.title }</Menu.Item></Link>
                        }
                        </div>
                    )
                    })}
                </Menu>
            </div>
        );
    }
}
