import React from 'react'
import { Show } from './Show'
import { Edit } from './Edit'
import { CustomMessage } from './CustomMessage'
import { getData, sendData } from '../../helpers'
import {SubTopic} from './SubTopic'

export class Topic extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      new: false,
      edit: false,
      message: '',
      status: -1,
      neg: false,
      name: '',
      description: '',
      activeTopicId: -1,
      subtopics: []
    }
  }


  componentWillReceiveProps(nextProps) {
    if (nextProps.topics !== undefined && nextProps.activeTopicId !== this.state.activeTopicId) {
			console.log("in topics will recive" , nextProps);
      var id = nextProps.activeTopicId
      var topic = nextProps.topics.map((topic) => {if (topic.id === id) {return topic}}).filter(Boolean)[0];
			if (topic === undefined) {
				this.setState({
					activeTopicId: -1,
					new: false,
					edit: false,
					name: '',
					description: '',
					subtopics: []
				})
			} else {
	      this.setState({
	        activeTopicId: id,
	        name: topic.name,
	        description: topic.description,
	      })
	      this.getSubTopics(id)
			}
    }
    if (nextProps.steliosToken === "null" || nextProps.steliosToken === null) {
      this.setState({
        new: false, edit: false
      });
    }
  }

  onSubTopicsChange = (subtopics) => {
    this.setState({
      subtopics
    })
  }

  getSubTopics = (id) => {
		var url = "topics/" + id + "/?fields=id,subtopics";
		var handleStatus = (res) => {
      console.log("it is here");
    }
		var handleData = (res) => {
      this.setState({
        subtopics: res.subtopics
      })
		}
		var handleError = (e) => {
			this.setState({
				message: e,
				status: -1,
				neg: true
			})
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

  onClickSave = (activeTopicId,name,description, markdown_content) => {
    this.props.onParentSubmit(activeTopicId, this.state.new)
    this.setState({
      activeTopicId,
      name,
      description,
      new: false,
      edit: false
    })
  }


  render() {
    console.log("in topic render: ", this.state.subtopics);
    const buttonGroup = {
      edit: this.state.edit || this.state.new || this.state.name === '' ?  undefined : this.onClickEdit,
      new: this.state.edit || this.state.new ?  undefined : this.onClickNew,
      delete: this.state.edit ? this.onClickDelete : undefined
    }
    if (this.state.edit) {
      return(
        <div>
          <CustomMessage
            onChangeMessage={this.onChangeMessage}
            header="Topic"
            status={this.state.status}
            message={this.state.message}
            neg={this.state.neg} />
          <Edit {...this.props}
            edit
            id={this.state.activeTopicId}
            name={this.state.name}
            description={this.state.description}
            buttonGroup={buttonGroup}
            method="PUT"
            onClickCancel={this.onClickCancel}
            header="topics"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            subTopics={this.state.subtopics}
            onSubTopicsChange={this.onSubTopicsChange}
            />
          {this.state.subtopics.map((subtopic) => {
            return <SubTopic {...this.props} subtopic={subtopic} activeTopicId={this.state.activeTopicId} />
          })}
        </div>
      )
    } else if (this.state.new) {
      return(
        <div>
          <CustomMessage onChangeMessage={this.onChangeMessage} header="Topic" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Edit {...this.props}
            new
            onSubTopicsChange={this.onSubTopicsChange}
            id={this.state.activeTopicId}
            name={this.state.name}
            description={this.state.description}
            buttonGroup={buttonGroup}
            method="POST"
            onClickCancel={this.onClickCancel}
            header="topics"
            onChangeMessage={this.onChangeMessage}
            onClickSave={this.onClickSave}
            />
        </div>
      )
    } else {
      return(
        <div>
          <CustomMessage onChangeMessage={this.onChangeMessage} header="Topic" status={this.state.status} message={this.state.message} neg={this.state.neg} />
          <Show {...this.props}
            buttonGroup={buttonGroup}
            header="topics"
            name={this.state.name}
            description={this.state.description}
            />
            {this.state.subtopics.map((subtopic) => {
              return <SubTopic {...this.props} subtopic={subtopic} activeTopicId={this.state.activeTopicId} />
            })}
        </div>
      )
    }
  }
}
