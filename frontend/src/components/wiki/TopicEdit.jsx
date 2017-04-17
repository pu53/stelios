import React from 'react'
import {List, Grid, Button} from 'semantic-ui-react'
import { getData, sendData } from '../../helpers'

export class TopicEdit extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeTopics: props.topics,
        allTopics: []
      }
      this.getAllTopics()
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.activeTopics !== nextProps.topics) {
        this.setState({
          activeTopics: nextProps.topics
        })
        this.getAllTopics()
      }
    }

    getAllTopics = () => {
      var url = "topics/?fields!=subtopics"
      var handleStatus = (res) => {}
      var handleData = (res) => {
        var copy = res
        var all_topics_without_active = copy.map((topic) => {
          if(!this.state.activeTopics.some((activeTopic) => {
            return topic.id === activeTopic.id
          })) {
            return topic
          }
        }).filter(Boolean)
        this.setState({
          allTopics: all_topics_without_active
        })
      }
      var handleError = (res) => {}
      getData(url,handleStatus, handleData,handleError)
    }


    onClickSave = () => {
      this.state.activeTopics.map((topic) => {
        if(!topic.subjects.some((subjectId) => {return subjectId === this.props.subjectId})) {
          var url = "topics/" + topic.id + "/"
          var method = "PUT"
          topic.subjects.push(this.props.subjectId)
          var body = {
            id: topic.id,
            subjects: topic.subjects
          }
          var handleStatus = (res) => {
            this.props.onChangeMessage(1)
            setTimeout(() => {
              this.props.onChangeMessage(res.status)
            }, 1000)
          }
          var handleData = (res) => {}
          var handleError = (e) => {
            this.props.onChangeMessage(-1, e, true)
          }

          sendData(url, method, body, handleStatus, handleData, handleError)
        }
      })
      this.state.allTopics.map((topic) => {
        var index = topic.subjects.indexOf(this.props.subjectId);
        if (index !== -1) {
          topic.subjects.splice(index, 1);
          var url = "topics/" + topic.id + "/"
          var method = "PUT"
          var body = {
            id: topic.id,
            subjects: topic.subjects
          }
          var handleStatus = (res) => {
            this.props.onChangeMessage(1)
            setTimeout(() => {
              this.props.onChangeMessage(res.status)
            }, 1000)
          }
          var handleData = (res) => {}
          var handleError = (e) => {
            this.props.onChangeMessage(-1, e, true)
          }
          sendData(url, method, body, handleStatus, handleData, handleError)
        }
      })
      this.props.updateTopics({topics: this.state.activeTopics})
      this.props.onClickSave()
    }

    onClickCancel = () => {
      this.props.onClickCancel()
    }

    onClickActiveTopic = (id) => {
      var active_topics = JSON.parse(JSON.stringify(this.state.activeTopics))
      var all_topics = this.state.allTopics
      for (var i in active_topics) {
        if (active_topics[i].id === id) {
          var topic_to_add = active_topics.splice(i,1)[0]
        }
      }
      all_topics.push(topic_to_add)
      this.setState({
        activeTopics: active_topics,
        allTopics: all_topics
      })
    }

    onClickAllTopic = (id) => {
      var active_topics = JSON.parse(JSON.stringify(this.state.activeTopics))
      var all_topics = this.state.allTopics
      for (var i in this.state.allTopics) {
        if (all_topics[i].id === id) {
          var topic_to_add = all_topics.splice(i,1)[0]
        }
      }
      active_topics.push(topic_to_add)
      this.setState({
        activeTopics: active_topics,
        allTopics: all_topics
      })
    }

    chosenTopics = () => {
      if (this.state.activeTopics !== undefined) {
        return(
          <List selection>
            {
              this.state.activeTopics.map(topic => {
              return (
                <List.Item as='a' onClick={(e) => {e.preventDefault(); this.onClickActiveTopic(topic.id)}} value={topic.id}>{topic.name}</List.Item>
              );
              })}
          </List>
        )
      } else {
        return(
          null
        )
      }
    }

    allTopics = () => {
      if (this.state.allTopics !== undefined) {
        return(
          <List selection>
            {
              this.state.allTopics.map(topic => {
              return (
                <List.Item as='a' onClick={(e) => {e.preventDefault(); this.onClickAllTopic(topic.id)}} value={topic.id}>{topic.name}</List.Item>
              );
              })}
          </List>
        )
      } else {
        return null
      }
    }

    render() {
      return (
        <Grid>
          <Grid.Column width={16}>
            <h4>Topics: </h4>
          </Grid.Column>
          <Grid.Column width={16}>
            <Button.Group basic fluid>
              <Button basic positive content="save" onClick={(e) => {e.preventDefault(); this.onClickSave()}} />
              <Button content="cancel" onClick={(e) => {e.preventDefault(); this.onClickCancel()}} />
            </Button.Group>
          </Grid.Column>
          <Grid.Row>
            <Grid.Column width={16}>
              <h5>Active topics:</h5>
              {this.chosenTopics()}
            </Grid.Column>
            <Grid.Column width={16}>
              <h5>All topics:</h5>
              {this.allTopics()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
}
