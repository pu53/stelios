import React from 'react'
import { Container, Header } from 'semantic-ui-react'

export class WelcomeMessage extends React.Component {
    constructor(props) {
		super(props);
	}

    render() {
        return (
            <div>
                <Container fluid>
                   <Header as='h1'>{'Welcome '+ this.props.username +'!'}</Header>
                   <br/>
                </Container>
           </div>
        );
    }
}
