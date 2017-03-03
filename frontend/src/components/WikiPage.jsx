import React from 'react'
import { WikiNav} from './WikiNav.jsx'
import { Dimmer, Loader, Grid} from 'semantic-ui-react'
import { Topic } from './Topic'
import { browserHistory } from 'react-router'

//supposed to render a single subject w/topics jabbe
export class WikiPage extends React.Component{
	constructor(props){
		super(props);

		this.state = ({
			result: [],
			id: 1,
			name: "",
			description: "",
			topics: [],
			active_topic: undefined
		});
		console.log(this.state);
		this.fetchData = this.fetchData.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){
		var id = this.props.params.subjectId;
		console.log("subject id: ", id)
		if (undefined !== id) {
			this.fetchData("subjectsonlytopicidandname", id);
		} else {
			this.fetchData("subjectsonlytopicidandname", "1");
		}
	}

	fetchData(domain,elm) {
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+domain+'/'+elm
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+domain+'/'+elm
		    // production code
		}


		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});

		fetch(request).then((res) => {
		return res.json();
		})
		.then((res) => {

			if (res.detail === "Not found.") {
				console.log("rip recursive");
				this.fetchData(domain,"1");
			} else {
				var nam = res["name"];
				console.log(nam);
	      this.setState({
					result: res,
					id: res["id"],
					description: res["description"],
					topics: res["topics"],
					name: nam
				});
			}
    }).then(() => {
			console.log(this.state.topics[0].id)
			if (this.props.params.topicId !== undefined) {
				this.handleClick(this.props.params.topicId);
			} else {
				this.handleClick(this.state.topics[0].id);
			}
		}).catch((e) => {console.log(e)});

	}

	handleClick(id) {
		console.log("handleclick id: ", id)
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/'+ 'topics/' + id
    		// dev code
    } else {
    		link = 'http://api.stelios.no/'+ 'topics/' + id
		    // production code
		}


		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});

		fetch(request).then((res) => {
      return res.json();
    })
    .then((res) => {
	      this.setState({
					active_topic: res
				});
    }).catch((e) => {console.log(e)});
	 }


	render(){
		if(this.state.name !== ""){
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}>
							<ul>
								{
									this.state.topics.map(topic => {
					        return (
									<li key={topic.id}>
										<a href="#" onClick={() => this.handleClick(topic.id)} value={topic.id}>{topic.name}</a>
									</li>
									);
					    	})}
							</ul>
						</Grid.Column>
						<Grid.Column width={13}>
							<h1>Subject: {this.state.name}</h1>
							<h3>{this.state.description}</h3>
							<br />
							<Topic topic={this.state.active_topic} />
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
