
import React from 'react'
import {Grid, Form, Input, Button} from 'semantic-ui-react'
import { ButtonGroup } from './ButtonGroup'
var SimpleMDE = require('react-simplemde-editor');
import { sendData } from '../../helpers'
import {SubTopicListEdit} from './SubTopicListEdit'


/* Show is a dumb component that displays name, description, (content), and buttongroup*/
export class Edit extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        id: this.props.id,
        name: this.props.name,
        description: this.props.description,
        markdownContent: this.props.markdownContent,
        loading: false,

        activeSubTopics: props.subTopics ? props.subTopics : [],
        allSubTopics: []
      }
    }

    componentWillReceiveProps(nextProps){
      if (!this.props.new) {
        if (this.state.id !== nextProps.id || this.state.name !== nextProps.name || this.state.description !== nextProps.description || this.state.markdownContent !== nextProps.markdownContent || this.state.activeSubTopics !== nextProps.subTopics ) {
          this.setState({
            id: nextProps.id,
            name: nextProps.name,
            description: nextProps.description,
            markdownContent: nextProps.markdownContent,
            activeSubTopics: nextProps.subTopics
          })
        }
      }
    }

    componentDidMount() {
      if(this.props.new) {
        this.setState({
          id: -1,
          name: '',
          description: '',
          markdownContent: '',
          activeSubTopics: []
        })
      }
    }

    onSubTopicListChange = (activeSubTopics, allSubTopics) => {
      this.setState({
        activeSubTopics, allSubTopics
      })
    }

    onNameChange = (e) => {
      this.setState({
        name: e.target.value
      })
    }

    onDescriptionChange = (e) => {
      this.setState({
        description: e.target.value
      })
    }

    onMarkdownContentChange = (e) => {
      console.log("in onMarkdownContentChange", e);
      this.setState({
        markdownContent: e
      })
    }

    onCancel = (e) => {
      e.preventDefault();
      this.setState({
        name: this.props.name,
        description: this.props.description,
        markdownContent: this.props.markdownContent
      })
      this.props.onClickCancel(e)
    }

    onClickSave = (e) => {
      console.log("in onClickSave ", this.state.markdownContent);
      this.setState({
        loading: true
      })
      var _id = this.state.id
      var _name = this.state.name
      var _description = this.state.description
      var _markdown_content = this.state.markdownContent
      e.preventDefault()
      var id = this.props.edit ? this.state.id.toString() + "/" : ""
      var url = this.props.header + "/" + id
      var method = this.props.method
      var body = {name: this.state.name, description: this.state.description}
      if (_markdown_content) {
        body['markdown_content'] = _markdown_content
      }
      var handleStatus = (res) => {
        this.props.onChangeMessage(res.status);
      }
      var handleData = (res) => {
        this.props.onClickSave(res.id, _name, _description, _markdown_content)
        this.setState({loading:false})
      }
      var handleError = (e) => {
        this.props.onChangeMessage(-1, e, true)
        this.setState({loading:false})
      }
      sendData(url,method,body,handleStatus,handleData,handleError)
      if (this.props.header === "topics") {
        console.log("in edit topiclist ", this.state.activeSubTopics, this.state.allSubTopics);
        this.state.activeSubTopics.map((subtopic) => {
          if(!subtopic.topics.some((topicId) => {return topicId === this.state.id})) {
            var url = "subtopics/" + subtopic.id + "/"
            var method = "PUT"
            subtopic.topics.push(this.state.id)
            var body = {
              id: subtopic.id,
              topics: subtopic.topics
            }
            var handleStatus = (res) => {
              this.props.onChangeMessage(res.status)
            }
            var handleData = (res) => {}
            var handleError = (e) => {
              this.props.onChangeMessage(-1, e, true)
            }

            sendData(url, method, body, handleStatus, handleData, handleError)
          }
        })
        this.state.allSubTopics.map((subtopic) => {
          var index = subtopic.topics.indexOf(this.state.id);
          console.log("in edit sub", index);
          if (index !== -1) {
            subtopic.topics.splice(index, 1);
            var url = "subtopics/" + subtopic.id + "/"
            var method = "PUT"
            var body = {
              id: subtopic.id,
              topics: subtopic.topics
            }
            var handleStatus = (res) => {
              this.props.onChangeMessage(res.status)
            }
            var handleData = (res) => {}
            var handleError = (e) => {
              this.props.onChangeMessage(-1, e, true)
            }
            sendData(url, method, body, handleStatus, handleData, handleError)
          }
        })
        this.props.onSubTopicsChange(this.state.activeSubTopics)
      }
    }


    render() {
      console.log("in edit renderer, ", this.state.id);
        return (
          <Form>
     				<Grid>
     					<Grid.Column width={12}>
     						<h2>{this.props.header}</h2>
     					</Grid.Column>
     					<Grid.Column width={4}>
     						<ButtonGroup {...this.props} {...this.props.buttonGroup} />
     					</Grid.Column>
     				</Grid>
     				<Form.Field>
     					<label>Name: </label>
     					<Input fluid focus value={this.state.name} onChange={this.onNameChange}/>
     				</Form.Field>
     				<Form.Field>
     					<label>Description: </label>
     					<Input fluid focus value={this.state.description} onChange={this.onDescriptionChange} />
     				</Form.Field>
            {
              this.props.header === "subtopics" ?
              <Form.Field>
                <label>Content:</label>
                <SimpleMDE
                  value={this.state.markdownContent}
                  onChange={this.onMarkdownContentChange}
                  options={{
                    autofocus: true,
                    spellChecker: false,
                  }}
                />
              </Form.Field>
              : null
            }
            {this.props.header === "topics" ?
              <SubTopicListEdit
                topicId={this.state.id}
                onChangeMessage={this.onChangeMessage}
                onSubTopicListChange={this.onSubTopicListChange}
                activeSubTopics={this.state.activeSubTopics}
                allSubTopics={this.state.allSubTopics}
                />
              :
              null
            }
    				<Form.Field>
       				<Grid>
       					<Grid.Row>
       						<Grid.Column width={8}>
       							<Button loading={this.state.loading} positive fluid content="Save" onClick={this.onClickSave} />
       						</Grid.Column>
       						<br />
       						<Grid.Column width={8}>
       							<Button negative fluid content="Cancel" onClick={this.onCancel} />
       						</Grid.Column>
       					</Grid.Row>
       				</Grid>
    				</Form.Field>
     			</Form>
        );
    }
}
