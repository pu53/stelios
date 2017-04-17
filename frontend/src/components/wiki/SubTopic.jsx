import React from 'react'
import {Grid, Divider} from 'semantic-ui-react'
import { Show } from './Show'
import { Edit } from './Edit'
import { CustomMessage } from './CustomMessage'
import { sendData } from '../../helpers'

//subtopic holds all subtopic info and displays it
export class SubTopic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new: false,
      edit: false,
      message: '',
      status: -1,
      neg: false,
      name: this.props.subtopic.name,
      description:this.props.subtopic.description,
      markdownContent: this.props.subtopic.content,
      activeTopicId: -1,
      id: this.props.subtopic.id
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.subtopic !== undefined) {
      var activeTopicId = nextProps.activeTopicId
      this.setState({
        activeTopicId,
        id: nextProps.subtopic.id,
        name: nextProps.subtopic.name,
        description: nextProps.subtopic.description,
        markdownContent: nextProps.subtopic.content
      })
    }
    if (nextProps.steliosToken === "null" || nextProps.steliosToken === null) {
      this.setState({
        new: false, edit: false
      });
    }
  }

  onChangeMessage = (status, message='', neg=false) => {
    this.setState({
      status, message, neg
    })
  }

  onClickEdit = (e) => {
    e.preventDefault()
    this.setState({
      edit: true,
      new: false
    })
  }

  onClickNew = (e) => {
    e.preventDefault()
    this.setState({
      new: true,
      edit: false
    })
  }


  onClickDelete = (e) => {
    e.preventDefault()
    if (confirm("Are you sure you want to delete this topic")) {
      var url = "topics/" + this.state.activeTopicId + "/"
      var method = "DELETE"
      var body = {id: this.state.activeTopicId}
      var handleStatus = (res) => {
        this.onChangeMessage(-1,'Topic deleted',false)
      }
      var handleData = (res) => {
        this.props.triggerRefresh();
        this.setState({
          new: false,
          edit: false
        })
      }
      var handleError = (e) => {this.onChangeMessage(-1, e, true)}
      sendData(url, method, body, handleStatus, handleData, handleError)
    }
  }

  onClickCancel = (e) => {
    e.preventDefault()
    this.setState({
      edit: false,
      new: false
    })
  }

  onClickSave = (id,name,description, markdownContent) => {
    this.setState({
      id,
      name,
      description,
      markdownContent,
      new: false,
      edit: false
    })
  }

  render() {
    const buttonGroup = {
      edit: this.state.edit || this.state.new ?  undefined : this.onClickEdit,
      new: this.state.edit || this.state.new ?  undefined : this.onClickNew,
      delete: this.state.edit ? this.onClickDelete : undefined
    }
    if (this.state.edit) {
      return(
        <div>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
          <CustomMessage
            onChangeMessage={this.onChangeMessage}
            header="Subtopic"
            status={this.state.status}
            message={this.state.message}
            neg={this.state.neg} />
          <Edit {...this.props}
            edit
            id={this.state.id}
            name={this.state.name}
            description={this.state.description}
            markdownContent={this.state.markdownContent}
            buttonGroup={buttonGroup}
            method="PUT"
            onClickCancel={this.onClickCancel}
            header="subtopics"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            />
        </div>
      )
    } else if (this.state.new) {
      return(
        <div>
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
          <CustomMessage onChangeMessage={this.onChangeMessage} header="Subtopic" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Edit {...this.props}
            new
            id={this.state.id}
            name={this.state.name}
            description={this.state.description}
            markdownContent={this.state.markdownContent}
            buttonGroup={buttonGroup}
            method="POST"
            onClickCancel={this.onClickCancel}
            header="subtopics"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            />
        </div>
      )
    } else {
      return(
        <div>

          <CustomMessage onChangeMessage={this.onChangeMessage} header="Subtopic" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Show {...this.props}
            buttonGroup={buttonGroup}
            header="subtopics"
            name={this.state.name}
            description={this.state.description}
            markdownContent={this.state.markdownContent}
            />
          <Grid.Column width={16}>
            <Divider />
          </Grid.Column>
        </div>
      )
    }
  }
}
