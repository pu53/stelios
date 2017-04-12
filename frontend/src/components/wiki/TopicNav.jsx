import React from 'react'
import {Segment, List, Grid, Button} from 'semantic-ui-react'
/*var Markdown = require('react-remarkable');*/
import { TopicEdit } from './TopicEdit'

/* Show is a dumb component that displays name, description, (content), and buttongroup*/
export class TopicNav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        edit: false
      }
    }

    onClickEdit = () => {
      this.setState({
        edit: true
      })
    }

    onClickSave = () => {
      this.setState({
        edit: false
      })
    }

    onClickCancel = () => {
      console.log("in onClickCancel");
      this.setState({
        edit: false
      })
    }

    render() {
      console.log("in topicNav ", this.props.topics);
      if (this.props.topics !== undefined) {
        if (!this.state.edit) {
          return (
            <Segment raised>
              <Grid>
                <Grid.Column width={16}>
                  <h4>Topics: </h4>
                </Grid.Column>
                <Grid.Column width={16}>
                  <Button basic fluid content="edit" onClick={(e) => {e.preventDefault(); this.onClickEdit()}} />
                </Grid.Column>
                <Grid.Row>
                  <Grid.Column width={16}>
                    <List selection>
                    {
                      this.props.topics.map(topic => {
                      return (
                        <List.Item as='a' onClick={(e) => {e.preventDefault(); this.props.clickTopic(topic.id)}} value={topic.id}>{topic.name}</List.Item>
                      );
                      })}
                    </List>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          );
        } else {
          return(
            <Segment raised>
              <TopicEdit
                {...this.props}
                topics={this.props.topics}
                onClickSave={this.onClickSave}
                onClickCancel={this.onClickCancel}
                />
            </Segment>

          )
        }
      } else {
        return(
          <Segment raised>

          </Segment>
        )
      }
    }
}
