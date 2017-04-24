import React from 'react'
import {List, Grid, Button} from 'semantic-ui-react'
import { getData, sendData } from '../../helpers'

/*
component that lives in topicNav, and is used to select between the topics.
it also updates the topics so that they are added or deleted to the current subject

this component works by having two arrays, one with the active items and one with the items you dont wish to have
when an item is clicked it is added to the other array and delted from the current one. This triggers a rerender of the component
If the user clicks save, it will update all changed topics in both arrays (because of how to backend is set up) and the parent component is updated
with the new active topics.
*/

export class TopicEdit extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeTopics: props.topics,
        allTopics: []
      }
      this.getAllTopics() //get every singel topic
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
        //filters out from alltopics the current active topics
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

    // Updates all topics that was changed. I.E active topics that were unselcted is updated to remove the subject. And vice versa.
    onClickSave = () => {
      this.state.activeTopics.map((topic) => {
        //checks if topic does not contain current subject from before.
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
        var index = topic.subjects.indexOf(this.props.subjectId); //checks if topic was previously in activeTopics
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

    //removes the topic from active and adds it to allTopics
    onClickActiveTopic = (id) => {
      //the json trick is used to create a (2) deep (4 meirl) copy
      //this is used so to not manipulate state directly in acordance with react guidelines
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
      //read above
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

    //return all activeTopics
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

    //returns all allTopics
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
