
import React from 'react'
import {Button} from 'semantic-ui-react'
import { getData, sendData } from '../../helpers'

/* ButtonGroup is a controlled dumb component that contains buttons.*/
export class ButtonGroup extends React.Component {
    constructor(props) {
      super(props);
      this.state = ({
        subscribed: false
      })
      //if buttongroup is called from subject (with the prop addSubject set to true), then the subscribe button should show
      //First we have to check if the user is allready subscribed to the course and set buttontext and methods acordingly
      if (props.addSubject) {
        let userID = localStorage.getItem('stelios_current_user')
        if(userID === 'null'){
            console.log("Error! No userID");
            return;
        }
        var url = "users/data/" + userID + "/"
        var handleStatus = (res) => {}
        var handleData = (res) => {
          var subjects = res.profile.subjects
          //check if current subject is in profile
          var subscribed = subjects.some((subject) => {
            return subject === parseInt(props.params.subjectId)
          })
          this.setState({
            subscribed
          })
        }
        var handleError = (res) => {}
        getData(url, handleStatus, handleData, handleError)
      }
    }

    //add this subject to current user.
    addSubject = (e) => {
      e.preventDefault()
      let userID = localStorage.getItem('stelios_current_user')
      if(userID === 'null'){
		      console.log("Error! No userID");
		      return;
	    }
      var url = "addSubject/"
      var method = this.state.subscribed ? "DELETE" : "PUT"
      var body = {
          user : userID,
          subject : this.props.params.subjectId
      }
      var handleStatus = (res) => {if(res.status >= 200 && res.status <= 204){
        this.setState({
          subscribed: !this.state.subscribed
        })
      }}

      sendData(url,method,body,handleStatus,(()=>{}),(()=>{}))
    }
    //Dumb uncontrolled component that returns subscribe button based on state and props
    SubscribeToSubject = () => {
      if (this.props.addSubject) {
        if (this.state.subscribed) {
          return(<Button onClick={this.addSubject}>Unsubscribe</Button>)
        } else {
          return(<Button onClick={this.addSubject}>Subscribe</Button>)
        }
      } else {
        return null
      }
    }
    render() {
      if (this.props.steliosToken === "null" || this.props.steliosToken === null) {
        return null
      }
      else {
        return (
          <Button.Group basic float="right">
            {this.SubscribeToSubject()}
            {this.props.edit && this.props.steliosUserProfessor !== "false" ? <Button content="Edit" onClick={this.props.edit} /> : null }
            {this.props.new && this.props.steliosUserProfessor !== "false" ? <Button content="New" onClick={this.props.new} /> : null }
            {this.props.delete && this.props.steliosUserProfessor !== "false" ? <Button basic negative content="Delete" onClick={this.props.delete} /> : null }
          </Button.Group>
        );
      }
    }
}
