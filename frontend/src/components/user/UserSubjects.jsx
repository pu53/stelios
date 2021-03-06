import React from 'react'

import { Menu, Header, Segment} from 'semantic-ui-react'
import { Link } from 'react-router'

/* Creates a list of links to a users subjects */
export class UserSubjects extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			<Header size='large'>Subjects</Header>
				<Segment style={{"padding":"0 0 0 0"}}>
					<Menu fluid vertical>
						{this.props.subjects.map(function(subject, index){
							return <Link to={'/wiki/'+subject.id} key={index}><Menu.Item >{ subject.name }</Menu.Item></Link>;
						})}
					</Menu>
				</Segment>
			</div>
		);
	}
}
