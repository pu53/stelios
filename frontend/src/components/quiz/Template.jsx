import React, { Component} from 'react';
import { Checkbox, Button, Form, Input, Segment, Grid, Select, Dropdown} from 'semantic-ui-react';
import { getData, sendData } from '../../helpers'

/* template for create and edit quiz :) */
export class Template extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: -1,
      title: "",
      subject: -1,
      questions: [],
      questionsToDelete: [],
      choicesToDelete: [],
      subjects: [],
      allSubTopics: [],
      done: false
    }
  }

  componentDidUpdate() {
    if (this.state.done) {
      this.props.changeQuizState("none")
    }
  }

  //This function gets all subjects and all subtopics, only with id and name
  componentWillMount() {
    var url = "subjects/?fields=id,name";
    var handleStatus = (res) => {this.props.onChangeMessage(res.status)}
    var handleData = (res) => {
      var newRes = res.map((subject) => {
        return {key: subject.id, value: subject.id, text: subject.name}
      })
      this.setState({subjects: newRes})
    }
    var handleError = (err) => {this.props.onChangeMessage(-1,err,true)}
    getData(url,handleStatus,handleData,handleError)

    var url_2 = "subtopics/?fields=id,name";
    var handleStatus_2 = (res) => {this.props.onChangeMessage(res.status)}
    var handleData_2 = (res) => {
      var newRes = res.map((subTopic) => {
        return {key: subTopic.id, value: subTopic.id, text: subTopic.name}
      })
      this.setState({allSubTopics: newRes})
    }
    var handleError_2 = (err) => {this.props.onChangeMessage(-1,err,true)}
    getData(url_2,handleStatus_2,handleData_2,handleError_2)
  }

  onTitleChange = (e) => {
    this.setState({
      title: e.target.value
    })
  }

  onNewQuestionClick = (e) => {
    e.preventDefault()
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy.push({id: -1, text: "", subtopic: [], choices: [{id: -1, choice_text: "", correct_answer: false}]});
    console.log(this.state.questions);
    console.log(questions_copy);
    this.setState({
      questions: questions_copy
    })
  }

  onQuestionTextChange = (e,i) => {
    console.log(e,i);
    e.preventDefault()
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy[i].text = e.target.value
    this.setState({
      questions: questions_copy
    })
  }

  onChoiceTextChange = (e,i,j) => {
    console.log(e,i,j);
    e.preventDefault();
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy[i]['choices'][j]['choice_text'] = e.target.value
    this.setState({
      questions: questions_copy
    })
  }

  onNewChoiceClick = (e,i) => {
    e.preventDefault();
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy[i].choices.push({id: -1, choice_text: "", correct_answer: false})
    this.setState({
      quiestions: questions_copy
    })
  }

  onChoiceCorrectAnswerChange = (e,test,i,j) => {
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy[i].choices[j].correct_answer = test.checked;
    this.setState({
      questions: questions_copy
    })
  }

  //deep deep save functions that saves everything. Done this way because of asynchronous hell
  saveQuiz = () => {
    var url = ""
    var method = ""
    var body = {}
    if (this.props.new) {
      url = "quiz/"
      method="POST"
      body = {title : this.state.title, subject: this.state.subject}
    } else {
      url="quiz/" + this.state.id + "/"
      body = {id: this.state.id, title: this.state.title, subject: this.state.subject}
    }
    var handleStatus = (res) => {
      this.props.onChangeMessage(res.status);
    }
    var handleData = (ress) => {
      this.setState({
        id: ress.id
      })
      this.state.questions.map((question,index) => {
        var url = ""
        var method = ""
        var body = {}
        if (this.props.new) {
          url = "question/"
          method="POST"
          body = {text: question.text, quiz: ress.id, subtopic: question.subtopic}
        } else {
          url="question/" + question.id + "/"
          body = {id: question.id, text: question.text, quiz: ress.id, subtopic: question.subtopic}
        }
        var handleStatus = (res) => {
          this.props.onChangeMessage(res.status);
        }
        var handleData = (res) => {
          var questions_copy = this.state.questions.map(q => Object.assign({}, q));
          questions_copy[index].id = res.id
          this.setState({
            questions: questions_copy
          })
          //this is where u save subtopics:
          question.choices.map((choice,ind) => {
            var url = ""
            var method = ""
            var body = {}
            if (this.props.new) {
              url = "choice/"
              method="POST"
              body = {choice_text: choice.choice_text, question: res.id, is_correct: choice.correct_answer}
            } else {
              url="choice/" + question.id + "/"
              body = {id: choice.id, choice_text: choice.choice_text, question: res.id, is_correct: choice.correct_answer}
            }
            var handleStatus = (result) => {
              this.props.onChangeMessage(result.status);
            }
            var handleData = (result) => {
              var questions_copy = this.state.questions.map(q => Object.assign({}, q));
              questions_copy[index].choices[ind].id = result.id
              this.setState({
                questions: questions_copy
              })
              if (index === this.state.questions.length-1 && ind === question.choices.length-1) {
                this.props.onChangeMessage(-1, "success!", false)
                this.setState({
                  done: true
                })
              }
            }
            var handleError = (error) => {
              this.props.onChangeMessage(-1, error, true)
            }
            sendData(url,method,body,handleStatus,handleData, handleError)
          })

        }
        var handleError = (e) => {
          this.props.onChangeMessage(-1, e, true)
        }
        sendData(url, method,body, handleStatus, handleData, handleError)
      })
    }
    var handleError = (e) => {
      this.props.onChangeMessage(-1, e, true)
    }
    sendData(url, method,body, handleStatus, handleData, handleError)
  }

  onSaveClick = (e) => {
    e.preventDefault()
    //first save quiz:
    this.saveQuiz()
  }

  onCancelClick = (e) => {
    e.preventDefault()
    this.props.changeQuizState("none")
  }

  onDeleteQuizClick = (e) => {
    e.preventDefault()
  }

  onDeleteQuestionClick = (e,i) => {
    e.preventDefault()
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    var thisWasDeleted = questions_copy.splice(i,1)
    this.setState({
      questions: questions_copy
    })
    if (thisWasDeleted.id !== -1) {
      var copy = this.state.questionsToDelete.map(q => Object.assign({}, q));
      copy.push(thisWasDeleted.id)
      this.setState({
        questionsToDelete: copy
      })
    }
  }

  onChoiceDeleteClick = (e,i,j) => {
    e.preventDefault()
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    var thisWasDeleted = questions_copy[i].choices.splice(j,1)
    this.setState({
      questions: questions_copy
    })
    if (thisWasDeleted.id !== -1) {
      var copy = this.state.choicesToDelete.map(q => Object.assign({}, q));
      copy.push(thisWasDeleted.id)
      this.setState({
        choicesToDelete: copy
      })
    }
  }

  onSubjectChange = (e, obj) => {
    this.setState({
      subject: obj.value
    })
  }

  onQuestionSubTopicChange = (e,obj, i) => {
    var questions_copy = this.state.questions.map(q => Object.assign({}, q));
    questions_copy[i].subtopic = obj.value
    console.log(questions_copy);
    this.setState({
      questions: questions_copy
    })
  }


  render () {
    return(
          <Form>
            <Segment>
              <Form.Field>
                {this.state.id !== -1 ? <Button basic negative content="Delete quiz" floated='right' onClick={this.onDeleteQuizClick}/> : null }
                <label>Title:</label>
                <Input fluid value={this.state.title} onChange={this.onTitleChange} />
              </Form.Field>
              <Form.Field>
                <label>Corresponding subject:</label>
                <Select placeholder='Select corresponding subject' options={this.state.subjects} value={this.state.subject} onChange={this.onSubjectChange}/>
              </Form.Field>
            </Segment>

            {this.state.questions.map((q,i) => {
              return(
                <Segment>
                  <Form.Field>
                    <Button basic negative content="Delete question" floated='right' onClick={(e) => this.onDeleteQuestionClick(e,i)}/>
                    <label>Question {i}:</label>
                    <Input placeholder="Question text" fluid value={q.text} onChange={(e) => this.onQuestionTextChange(e,i)} />
                  </Form.Field>
                  <Form.Field>
                    <label>Corresponding subtopics: </label>
                    <Dropdown placeholder='corresponding subtopics' value={q.subtopic} fluid multiple search selection options={this.state.allSubTopics} onChange={(e,obj,test) => this.onQuestionSubTopicChange(e,obj,i)} />
                  </Form.Field>
                    {q.choices.map((choice, j) => {
                      return(
                        <Segment raised>
                          <Form.Field>
                            <Button basic negative content="Delete choice" floated='right' onClick={(e) => this.onChoiceDeleteClick(e,i,j)} />
                            <label>Choice {j}:</label>
                            <Checkbox label='Correct answer' defaultChecked={choice.correct_answer} onChange={(e,test) => this.onChoiceCorrectAnswerChange(e,test,i,j)}/>
                            <Input fluid value={choice.choice_text} onChange={(e) => this.onChoiceTextChange(e,i,j)} />
                          </Form.Field>
                        </Segment>
                      )
                    })}
                  <Button content="Add choice" onClick={(e) => this.onNewChoiceClick(e,i)} />

                </Segment>
              )
            })}
            <Form.Field>
              <Grid>
                <Grid.Column width={16}>
                  <Button content="Add question" onClick={this.onNewQuestionClick} />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Button fluid positive content="save" onClick={this.onSaveClick} />
                </Grid.Column>
                <Grid.Column width={8}>
                  <Button fluid negative content="cancel" onClick={this.onCancelClick} />
                </Grid.Column>
              </Grid>
            </Form.Field>
          </Form>
    )
  }
}
