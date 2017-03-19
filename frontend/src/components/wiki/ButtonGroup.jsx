
import React from 'react'
import {Button} from 'semantic-ui-react'

/* ButtonGroup is a controlled dumb component that contains buttons.*/
export class ButtonGroup extends React.Component {

    render() {
        return (
          <Button.Group basic float="right">
            {this.props.edit ? <Button content="Edit" onClick={this.props.edit} /> : null }
            {this.props.new ? <Button content="New" onClick={this.props.new} /> : null }
            {this.props.delete ? <Button basic negative content="Delete" onClick={this.props.delete} /> : null }
          </Button.Group>
        );
    }
}
