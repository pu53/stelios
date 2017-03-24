
import React from 'react'
import {Message} from 'semantic-ui-react'

/* Show is a dumb component that displays name, description, (content), and buttongroup*/
export class CustomMessage extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        message: "",
        status: -1
      }
    }

    componentWillReceiveProps(nextProps) {
      console.log("next, ",nextProps);
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
          console.log("cm ", nextProps)
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
            <Message positive={!this.props.neg} negative={this.props.neg} hidden={this.state.message === ""}>
      				<Message.Header>{this.state.message !== undefined ? this.state.message.toString() : null}</Message.Header>
      			</Message>
            <br/>
          </div>
        );
    }
  }
}
