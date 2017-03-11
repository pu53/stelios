import React, { Component} from 'react';
import { Container, Grid, Button } from 'semantic-ui-react';
import { SearchBar } from './SearchBar';
import { Quiz } from './Quiz'

export class QuizPage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	componentDidMount() {
		this.fetchData()
	}
	
	fetchData() {
		return("");
	}
	
	render() {
		
		return(
			<Grid>
				<Grid.Row>
					<Grid.Column width={8}>
						<Quiz/>
					</Grid.Column>
					<Grid.Column width={8}>
						<Quiz/>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		);
	}
}
