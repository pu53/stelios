import React from 'react'
import {List, Grid, Button} from 'semantic-ui-react'
import { getData, sendData } from '../../helpers'

export class SubTopicListEdit extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        activeSubTopics: props.subTopics,
        allSubTopics: []
      }
      this.getallSubTopics()
    }

    componentWillReceiveProps(nextProps) {
      if (this.state.activeSubTopics !== nextProps.subTopics) {
        this.setState({
          activeSubTopics: nextProps.subTopics
        })
        this.getallSubTopics()
      }
    }

    getallSubTopics = () => {
      var url = "subtopics/?fields!=subjects"
      var handleStatus = (res) => {}
      var handleData = (res) => {
        var copy = res
        if(this.state.activeSubTopics !== undefined) {
          var all_subtopics_without_active = copy.map((subtopic) => {
            if(!this.state.activeSubTopics.some((activeSubTopic) => {
              return subtopic.id === activeSubTopic.id
            })) {
              return subtopic
            }
          }).filter(Boolean)
        } else {
          var all_subtopics_without_active = copy
        }
        this.setState({
          allSubTopics: all_subtopics_without_active
        })
      }
      var handleError = (res) => {}
      getData(url,handleStatus, handleData,handleError)
    }


    onClickActiveTopic = (id) => {
      var active_sub_topics = JSON.parse(JSON.stringify(this.state.activeSubTopics))
      var all_sub_topics = this.state.allSubTopics
      for (var i in active_sub_topics) {
        if (active_sub_topics[i].id === id) {
          var sub_topic_to_add = active_sub_topics.splice(i,1)[0]
        }
      }
      all_sub_topics.push(sub_topic_to_add)
      this.setState({
        activeSubTopics: active_sub_topics,
        allSubTopics: all_sub_topics
      })
      this.props.onSubTopicListChange(active_sub_topics, all_sub_topics)
    }

    onClickAllTopic = (id) => {
      var active_sub_topics = JSON.parse(JSON.stringify(this.state.activeSubTopics))
      var all_sub_topics = this.state.allSubTopics
      for (var i in this.state.allSubTopics) {
        if (all_sub_topics[i].id === id) {
          var sub_topic_to_add = all_sub_topics.splice(i,1)[0]
        }
      }
      active_sub_topics.push(sub_topic_to_add)
      this.setState({
        activeSubTopics: active_sub_topics,
        allSubTopics: all_sub_topics
      })
      this.props.onSubTopicListChange(active_sub_topics, all_sub_topics)
    }

    chosenTopics = () => {
      if (this.state.activeSubTopics !== undefined) {
        return(
          <List selection>
            {
              this.state.activeSubTopics.map(subtopic => {
              return (
                <List.Item as='a' onClick={(e) => {e.preventDefault(); this.onClickActiveTopic(subtopic.id)}} value={subtopic.id}>{subtopic.name}</List.Item>
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

    allSubTopics = () => {
      if (this.state.allSubTopics !== undefined) {
        return(
          <List selection>
            {
              this.state.allSubTopics.map(subtopic => {
              return (
                <List.Item as='a' onClick={(e) => {e.preventDefault(); this.onClickAllTopic(subtopic.id)}} value={subtopic.id}>{subtopic.name}</List.Item>
              );
              })}
          </List>
        )
      } else {
        return null
      }
    }

    render() {
      console.log("topicedit state: ", this.state);
      return (
        <Grid>
          <Grid.Column width={16}>
            <h4>SubTopics: </h4>
          </Grid.Column>
          <Grid.Row>
            <Grid.Column width={16}>
              <h5>Active SubTopics:</h5>
              {this.chosenTopics()}
            </Grid.Column>
            <Grid.Column width={16}>
              <h5>All SubTopics:</h5>
              {this.allSubTopics()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
}