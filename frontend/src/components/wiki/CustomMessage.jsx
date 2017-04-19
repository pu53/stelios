
import React from 'react'
import {Message} from 'semantic-ui-react'

// Custom message shows a message and based on props will be negative or positive.
// It will automaticly disable itself after a timeinterval, now it is 5 seconds
// You can also just pass it a status, and it will figure out correct message to display
export class CustomMessage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        message: '',
        status: -1
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.message !== nextProps.message || this.state.status !== nextProps.status) {
        this.setState({
          message: nextProps.message,
          status: nextProps.status
        })
        setTimeout(() => {
          this.setState({
            message: '',
            status: -1
          })
          nextProps.onChangeMessage(-1, '', false)
        }, 5000)
      }
    }

    render() {
      const status = this.state.status
      if (status === 200) {
          return(
            <Message positive>
      				<Message.Header>{this.props.header + " updated"}</Message.Header>
      			</Message>
          )
      } else if (status === 201) {
          return(
            <Message positive>
      				<Message.Header>{this.props.header + " created"}</Message.Header>
      			</Message>
          )
      } else if (status === 403) {
          return(
            <Message negative>
      				<Message.Header>{"You dont have access to create/update this " + this.props.header}</Message.Header>
      			</Message>
          )
      } else if (status === 404) {
          return(
            <Message positive>
      				<Message.Header>{"Couldnt find " + this.props.header}</Message.Header>
      			</Message>
          )
      } else if (status === "server error") {
          return(
            <Message negative>
      				<Message.Header>{"Couldnt reach server api.stelios.no"}</Message.Header>
      			</Message>
          )
      } else {
        return (
          <div>
            <Message positive={this.props.pos} negative={this.props.neg} hidden={this.state.message === ''}>
      				<Message.Header>{this.state.message !== undefined ? this.state.message.toString() : null}</Message.Header>
      			</Message>
            <br/>
          </div>
        );
    }
  }
}
