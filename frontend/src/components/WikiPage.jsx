import React from 'react'
import { WikiNav} from './WikiNav.jsx'
import { Dimmer, Loader, Grid} from 'semantic-ui-react'
import { Topic } from './Topic'
import { browserHistory } from 'react-router'

//supposed to render a single subject w/topics jabbe
export class WikiPage extends React.Component{
	constructor(props){
		super(props);
		var topicId = this.props.params.topicId;
		console.log(this.props.params);
		if (undefined === topicId) {
			topicId = 0;
		}
		this.state = ({
			result: [],
			id: 0,
			name: "",
			description: "",
			topics: [],
			active_topic: topicId
		});
		this.fetchData = this.fetchData.bind(this);
		this.handleClick = this.handleClick.bind(this);
	}

	componentDidMount(){
		var id = this.props.params.subjectId;
		if (undefined != id) {
			this.fetchData("subjects", id);
		} else {
			this.fetchData("subjects", "1");
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
			if(res.detail === "Not found.") {
				this.fetchData(domain,"1");
			} else {
				this.setState({
					result: res,
					id: res["id"],
					name: res["name"],
					description: res["description"],
					topics: res["topics"]});
			}
			// const subjectKeys = Object.keys(res[0]);
			// console.log(subjectKeys);

		}).catch((e) => {console.log(e)});
	}

	handleClick(key) {
			this.setState({
				active_topic: key
		  });
	 }


	render(){
		if(Object.keys(this.state.result).length){
			var topics = this.state.topics;
			return(
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}>
							<li>
								{
									Object.keys(topics).map(key => {
					        return (
										<ul>
											<a href="#" onClick={() => this.handleClick(key)} value={key}>{topics[key].name}</a>
										</ul>
									);
					    	})}
							</li>
						</Grid.Column>
						<Grid.Column width={13}>
							<h1>Subject: {this.state.name}</h1>
							<h3>{this.state.description}</h3>
							<br />
							<Topic topic={this.state.topics[this.state.active_topic]} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			);
		}else{
			return (
				<Dimmer active inverted>
        	<Loader inverted>Loading</Loader>
      	</Dimmer>
			);
		}
}
}





			// { this.state.result.map((user) =>
			// 	(
			// 		<ul key={user.id}>
			// 			{Object.keys(user).map((key) =>
			// 			(
			// 				<li key={key}>{key}:  {user[key].toString()}</li>
			// 				)
			// 			)}
			// 			<br />
			// 			</ul>
			// 		)
			// 	)
			// }
