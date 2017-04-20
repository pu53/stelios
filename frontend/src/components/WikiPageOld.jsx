import React from 'react'
import { WikiNav} from './WikiNav.jsx'
import { Dimmer, Loader, Grid, Button, Divider, Segment, List, Form, Input, Message, Dropdown, Header} from 'semantic-ui-react'
import { Topic } from './Topic'
import { browserHistory } from 'react-router'

//supposed to render a single subject w/topics jabbe
export class WikiPage extends React.Component{
	displayName="WikiPage"
	constructor(props){
		super(props);

		this.state = ({
			result: [],
			id: -1,
			name: "",
			description: "",
			topics: [],
			topics_id: [],
			active_topic: undefined,
			prev_active_topic: undefined,
			edit: false,
			new: false,
			loading: false,
			message: '',
			neg: false,
			all_topics: []
		});
	}

	componentDidMount(){
		var id = this.props.params.subjectId;
		if (id !== undefined) {
			id = parseInt(id)
		}
		this.dataLoad("subjectsonlytopicidandname/?fields=id,name",
			(() => {}),
			((res) => {
				if (!res.some((subject) => { return subject.id === id})){
					if (id !== undefined) {
						this.setState({
							message: "Subject not found, reverting to first subject",
							neg: true,
						});
						setTimeout(() => {
						  this.setState({ message: "" });
						}, 10000);
					}
					id = res[0].id
				}
				this.dataLoad("subjectsonlytopicidandname/" + id.toString() +"/",
					(() => {}),
					((resu) => {
						this.setState({
							result: resu,
							id: resu["id"],
							description: resu["description"],
							topics: resu["topics"],
							topics_id: resu["topics"].map((topic) => {return topic.id}),
							name: resu["name"]
						});
						var topic_id = this.props.params.topicId;
						if (!resu.topics.some((topic) => {return topic.id === topic_id})) {
							if(topic_id !== undefined) {
								this.setState({
									message: "Topic not found, reverting to first topic",
									neg: true,
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							}
							console.log(resu.topics);
							if (resu.topics[0] !== undefined) {
								topic_id = resu.topics[0].id;
							} else {
								topic_id = undefined;
							}
						}
						this.dataLoad("topics/" + topic_id,
							(() => {}),
							((resul) => {
								this.setState({
									active_topic: resul,
									prev_active_topic: resul
								});
							})
						)
					})
				)
			})
		);
	}

	dataLoad = (url, prejson, dataFunc) => {
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ url;
    } else {
    		link = 'https://stelios.no/api/'+ url;
		}
		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});
		fetch(request).then((res) => {
			prejson(res)
      return res.json();
    })
    .then((res) => {
			dataFunc(res);
    }).catch((e) => {console.log(e)});
	}

	buttonGroup(clickEdit=((e) => {e.preventDefault();}), clickNew=((e) => {e.preventDefault();}), clickDelete=((e) => {e.preventDefault();}), clickRemove=((e) => {e.preventDefault()})) {
		return(<Button.Group basic float="right">
			{ this.state.new || this.state.edit ?
			null
			:
			<Button content="Edit"  onClick={(e) => clickEdit(e)} />
			}
			{ !this.state.new ?
				<Button content="New" onClick={(e) => clickNew(e)} />
				:
				null
			}
			{
				this.displayName !== "WikiPage" && this.state.edit ?
				<Button basic negative content={"Remove from " + this.displayName} onClick={(e) => clickRemove(e)} />
				:
				null
			}
			{ this.state.edit ?
				<Button basic negative content="Delete" onClick={(e) => clickDelete(e)} />
				:
				null
			}
		</Button.Group>
		);
	}

	show(header, description, clickEdit, clickNew) {
		console.log("show is called in", this.displayName);
 		return(
 			<div>
 				<Grid>
 					<Grid.Column width={12}>
 						<h2>{header}</h2>
 					</Grid.Column>
 					<Grid.Column width={4}>
 					{this.buttonGroup(clickEdit, clickNew, ((e) => {e.preventDefault();}))}
 					</Grid.Column>
 				</Grid>
 				<br/>
 				<p><b>{description}</b></p>
 				<br/>
 			</div>
 		);
 	}

 	edit(header, name, description, belongs_to, all_sub_things, clickNew, changeName, changeDescription, clickSave, clickCancel, update=(() => {}), clickDelete=((e) => {e.preventDefault()})) {
		console.log(this.state.id);
		return(
 			<Form>
 				<Grid>
 					<Grid.Column width={12}>
 						<h2>{header}</h2>
 					</Grid.Column>
 					<Grid.Column width={4}>
 						{this.buttonGroup(((e) => {e.preventDefault();}),clickNew, clickDelete)}
 					</Grid.Column>
 				</Grid>
 				<Form.Field>
 					<label>Name: </label>
 					<Input fluid focus value={name} onChange={(e) => changeName(e)} />
 					</Form.Field>
 				<Form.Field>
 					<label>Description: </label>
 					<Input fluid focus value={description} onChange={(e) => changeDescription(e)} />
 				</Form.Field>
				<Form.Field>
 				<Grid>
 					<Grid.Row>
 						<Grid.Column width={8}>
 							<Button positive fluid loading={this.state.loading} content="Save" onClick={(e) => {clickSave(e); update()}} />
 						</Grid.Column>
 						<br />
 						<Grid.Column width={8}>
 							<Button negative fluid content="Cancel" onClick={(e) => {clickCancel(e)}} />
 						</Grid.Column>
 					</Grid.Row>
 				</Grid>
				</Form.Field>
				<Form.Field>
					<label>{"Add " + belongs_to}</label>
					<Dropdown placeholder={this.state.id ===-1 ? 'Create subject before selecting topics' : 'ps: ' + belongs_to + ' are added automaticly when chosen'} disabled={this.state.id===-1} fluid search selection scrolling onChange={(e,{value}) => {this.setState({dropdown_id: value})}} options={all_sub_things} />
				</Form.Field>
 				<br />
 			</Form>
 		);
 	}

	handleSave = (e, urll, method_, header, body, preJson) => {
		console.log(urll, method_, header, body);
		console.log(JSON.stringify(body));
		if (e !== undefined) {
			e.preventDefault();
		}

		this.setState({
			loading: true
		});

		var token = localStorage.getItem('stelios_token');
		if (token === "null") {
			this.setState({
				message: "You need to login first",
				neg: true,
				loading: false
			});
			setTimeout(() => {
			  this.setState({ message: "" });
			}, 10000);
			return
		}

		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ urll;
    		// dev code
    } else {
    		link = 'https://stelios.no/api/' +urll;
		    // production code
		}

		var request = new Request(link, {
			method: method_,
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Token ' + token
			},
      body: JSON.stringify(body)
		});
		fetch(request).then((res) => {
			console.log(res.status);
			preJson(res);
      return res.json();
    })
    .then((res) => {
			if (method_ === "POST") {
				this.setState({
					id: res.id
				});
			}
			this.setState({
				loading: false
			});
    }).catch((e) => {
			console.log(e);
			this.setState({
				loading: false
			});
		});
	}

	test = () => {
		console.log("test was successful");
	}

	getTopics = () => {
		this.dataLoad(
			"topics/?fields!=subtopics",
			(() => {}),
			((res) => {
				console.log(res);
				var all_top = [];
				res.map((topic, index) => {
					all_top.push({
							value: topic.id,
							key: topic.id,
							text: topic.name,
							content: <Header content={topic.name} subheader={topic.description} onClick={(e) => {
								console.log(this);
								console.log(topic.id);
								if (!topic.subjects.some((subject_id) => {return subject_id === this.state.id})) {
									topic.subjects.push(this.state.id);
								}
								console.log(topic.subjects);
								this.test();
								this.handleSave(
									e,
									"topics/" + topic.id + "/",
									"PUT",
									"topic",
									{"subjects" : topic.subjects},
									((res) => {
										if (res.status === 200 || res.status === 201) {
											this.setState({
												message: "Topic updated",
												neg: false
											});
											setTimeout(() => {
											  this.setState({ message: "" });
											}, 10000);
										} else if (res.status === 403) {
											this.setState({
												message: "You dont have access to update this topic",
												neg: true
											});
											setTimeout(() => {
											  this.setState({ message: "" });
											}, 10000);
										}
									})
								);
								setTimeout(() => this.componentDidMount(),3000);

							}} />
					});
				});
				this.setState({
					all_topics: all_top
				});
			})
		);
	}

	updateSubjectTopic = () => {
		this.state.topics_id.map((id)=>{
			console.log("in updateSubjectTopic with id: ", id);
			this.setState({
				loading: true
			});

			var token = localStorage.getItem('stelios_token');
			if (token === "null") {
				this.setState({
					message: "You need to login first",
					neg: true,
					loading: false
				});
				setTimeout(() => {
				  this.setState({ message: "" });
				}, 10000);
				return
			}

			var link = '';
			if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
				link = 'http://localhost:8000/'+ "topics/" + id + "/";
	    		// dev code
	    } else {
	    		link = 'https://stelios.no/api/' + "topics/" + id + "/";
			    // production code
			}

			var request = new Request(link, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Token ' + token
				},
	      body: JSON.stringify({
					subjects: [this.state.id]
				})
			});
			fetch(request).then((res) => {
				console.log(res.status);
				if (res.status === 200 || res.status === 201) {
					this.setState({
						message: "Subject and topic updated",
						neg: false
					});
					setTimeout(() => {
						this.setState({ message: "" });
					}, 10000);
				} else if (res.status === 403) {
					this.setState({
						message: "You dont have access to edit/create this subject/topics",
						neg: true
					});
					setTimeout(() => {
						this.setState({ message: "" });
					}, 10000);
				}
	      return res.json();
	    })
	    .then((res) => {
				this.setState({
					loading: false
				});
	    }).catch((e) => {
				console.log(e);
				this.setState({
					loading: false
				});
			});
		})
	}

	subject() {
		if(this.state.new) {
			return(
				this.edit(
					"Create subject: ",
					this.state.name,
					this.state.description,
					"topics",
					this.state.all_topics,
					((e) => {
						e.preventDefault();
						this.getTopics();
						this.setState({
						id: -1,
						name: "",
						description: "",
						topics: [],
						active_topic: undefined,
						topics_id: []
					});}),
					((e) => {this.setState({name: e.target.value})}),
					((e) => {this.setState({description: e.target.value})}),
					((e) => {this.handleSave(e,
						'subjects/',
						"POST",
						"Subject",
						{name: this.state.name, description: this.state.description},
						((res) => {
							if (res.status === 200 || res.status === 201) {
								this.setState({
									message: "Subject created",
									neg: false
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 403) {
								this.setState({
									message: "You dont have access to create this subject",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							}
						})
					)}),
					((e) => {e.preventDefault(); this.setState({
						id: this.state.result.id,
						name: this.state.result.name,
						description: this.state.result.description,
						topics: this.state.result.topics,
						active_topic: this.state.prev_active_topic,
						new: false
					})}),
					(() => this.updateSubjectTopic())
				)
			)
		} else if(this.state.edit) {
			return(
				this.edit(
					"Edit subject: ",
					this.state.name,
					this.state.description,
					"topics",
					this.state.all_topics,
					((e) => {
						e.preventDefault();
						this.getTopics();
						this.setState({
						id: -1,
						new: true,
						edit: false,
						name: "",
						description: "",
						topics: [],
						active_topic: undefined,
						topics_id: []
					})}),
					((e) => {this.setState({name: e.target.value})}),
					((e) => {this.setState({description: e.target.value})}),
					((e) => {this.handleSave(e,
						'subjects/' + this.state.id + '/',
						"PUT",
						"Subject",
						{name: this.state.name, description: this.state.description},
						((res) => {
							if (res.status === 200 || res.status === 201) {
								this.setState({
									message: "Subject updated",
									neg: false
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 403) {
								this.setState({
									message: "You dont have access to edit/create this subject",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							}
						})
					)}),
					((e) => {e.preventDefault(); this.setState({
						id: this.state.result.id,
						name: this.state.result.name,
						description: this.state.result.description,
						edit: false,
					})}),
					(() => this.updateSubjectTopic()),
					((e) => {this.handleSave(e,
						'subjects/' + this.state.id + '/',
					 	"DELETE",
						"Subject",
						null,
						((res) => {
							if (res.status === 403) {
								this.setState({
									message: "You dont have access to delete this subject",
									neg: true
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
							} else if (res.status === 204) {
								this.setState({
									message: "Subject deleted",
									neg: false,
									edit: false,
									new: false,
								});
								setTimeout(() => {
								  this.setState({ message: "" });
								}, 10000);
								this.componentDidMount();
							}
						})
					)})
				));
		} else {
			return(
				this.show(
					this.state.name,
					this.state.description,
					(() => {
						this.setState({edit: true});
						this.getTopics();
					}),
					((e) => {
						e.preventDefault();
						this.getTopics();
						this.setState({
						id: -1,
						new: true,
						name: "",
						description: "",
						topics: [],
						active_topic: undefined,
						topics_id: []
					})})
				)
			);
		}
	}

	message() {
		return(
			<Message positive={!this.state.neg} negative={this.state.neg} hidden={this.state.message === ""}>
				<Message.Header>{this.state.message}</Message.Header>
			</Message>
		);
	}

	render(){
		if(this.state.result !== []){
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}>
							<Segment raised>
								<h4>Topics: </h4>
								<List selection >
								{
									this.state.topics.map(topic => {
									return (
										<List.Item as='a' onClick={() => this.handleClick(topic.id)} value={topic.id}>{topic.name}</List.Item>
									);
						    	})}
								</List>
							</Segment>
						</Grid.Column>
						<Grid.Column width={13}>
							<Segment raised>
								{this.message()}
								{this.subject()}
									<Grid.Column width={16}>
										<Divider />
									</Grid.Column>
									<br />
								<Topic
									topic={this.state.active_topic}
									subjectId={this.state.id}
									dataLoad = {this.dataLoad}
									buttonGroup = {this.buttonGroup}
									show={this.show}
									edit={this.edit}
									handleSave = {this.handleSave}
									message= {this.message}
									/>
							</Segment>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}else{
			return (
				<Dimmer active inverted>
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}>
			        	<Loader inverted>Loading</Loader>
						</Grid.Column>
						<Grid.Column width={13}>
			        	<Loader inverted>Loading</Loader>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Dimmer>
			);
		}
	}
}
