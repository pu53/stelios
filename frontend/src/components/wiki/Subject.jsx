import React from 'react'
import { Show } from './Show'
import { Edit } from './Edit'
import { CustomMessage } from './CustomMessage'
import { getData, sendData } from '../../helpers'

export class Subject extends React.Component {
  displayName="Subject"
  constructor(props) {
    super(props)
    this.state = {
      new: false,
      edit: false,
      message: '',
      status: -1,
      neg: false,
      subjectId: this.props.subjectId,
      name: '',
      description: ''
    }
  }

  componentDidMount() {
    if(this.state.subjectId !== undefined) {
      this.getSubject(this.state.subjectId)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.subjectId !== nextProps.subjectId) {
      this.setState({
        subjectId: nextProps.subjectId
      })
      this.getSubject(nextProps.subjectId)
    }
    if (nextProps.steliosToken === "null" || nextProps.steliosToken === null) {
      this.setState({
        new: false, edit: false
      });
    }
  }

  getSubject = (id) => {
		var url = "subjectswithoutsubtopics/" + id + "/";
		var handleStatus = (res) => {}
		var handleData = (res) => {
      this.props.updateTopics(res)
      this.setState({
        name: res.name,
        description: res.description
      })
		}
		var handleError = (e) => {
      if (e.toString().substring(0,6) !== "Syntax") {
        this.setState({
          message: e,
          status: -1,
          neg: true
        })
      }

		}
		getData(url, handleStatus, handleData, handleError)
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
    this.props.onSubjectNew()
  }


  onClickDelete = (e) => {
    e.preventDefault()
    if (confirm("Are you sure you want to delete this subject?")) {
      var url = "subjects/" + this.props.subjectId + "/"
      var method = "DELETE"
      var body = {id: this.props.subjectId}
      var handleStatus = (res) => {
        this.onChangeMessage(-1,'',false)
        this.props.blockMessage(-1, "Subject deleted", false);
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
    this.props.onSubjectNotNew()
  }

  onClickSave = (subjectId,name,description, markdown_content) => {
    this.props.onParentSubmit(subjectId, this.state.new)
    this.setState({
      subjectId,
      name,
      description,
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
          <CustomMessage
            onChangeMessage={this.onChangeMessage}
            header="Subject"
            status={this.state.status}
            message={this.state.message}
            neg={this.state.neg} />
          <Edit
            {...this.props}
            edit
            id={this.state.subjectId}
            name={this.state.name}
            description={this.state.description}
            buttonGroup={buttonGroup}
            method="PUT"
            onClickCancel={this.onClickCancel}
            header="subjects"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            />
        </div>
      )
    } else if (this.state.new) {
      return(
        <div>
          <CustomMessage onChangeMessage={this.onChangeMessage} header="Subject" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Edit
            {...this.props}
            new
            id={this.state.subjectId}
            name={this.state.name}
            description={this.state.description}
            buttonGroup={buttonGroup}
            method="POST"
            onClickCancel={this.onClickCancel}
            header="subjects"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            />
        </div>
      )
    } else {
      return(
        <div>
          <CustomMessage onChangeMessage={this.onChangeMessage} header="Subject" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Show {...this.props}
            buttonGroup={buttonGroup}
            header="subjects"
            name={this.state.name}
            description={this.state.description}
            />
        </div>
      )
    }
  }
}
