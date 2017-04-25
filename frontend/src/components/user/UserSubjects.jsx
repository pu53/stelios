import React from 'react'
import { NavLink } from '../NavLink.jsx';
import { Menu, Header } from 'semantic-ui-react'

export class UserSubjects extends React.Component {
	constructor(props) {
		super(props);
	}

	/* Creates a list of links to a users subjects */
	render() {
		return (
			<div>
			<Header size='large'>Subjects</Header>
				<Menu fluid vertical>
					{this.props.subjects.map(function(subject, index){
						return <NavLink to={'/wiki/'+subject.id} key={index}><Menu.Item >{ subject.name }</Menu.Item></NavLink>;
					})}
				</Menu>
			</div>
        );
    }
}
