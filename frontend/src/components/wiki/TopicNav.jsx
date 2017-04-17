import React from 'react'
import {Segment, List, Grid, Button} from 'semantic-ui-react'
/*var Markdown = require('react-remarkable');*/
import { TopicEdit } from './TopicEdit'

//topicnav holds all topics, and the user can select between them, aswell as edit topics in the subject.
export class TopicNav extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        edit: false
      }
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.steliosToken === "null" || nextProps.steliosToken === null) {
        this.setState({
          edit: false
        });
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
      this.setState({
        edit: false
      })
    }

    render() {
      if (this.props.topics !== undefined) {
        if (!this.state.edit) {
          return (
            <Segment raised>
              <Grid>
                <Grid.Column width={16}>
                  <h4>Topics: </h4>
                </Grid.Column>
                { this.props.steliosToken === "null" || this.props.steliosToken === null ? null :
                  <Grid.Column width={16}>
                    <Button basic fluid content="edit" onClick={(e) => {e.preventDefault(); this.onClickEdit()}} />
                  </Grid.Column>
                }
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
