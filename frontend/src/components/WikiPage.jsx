import React from 'react'
import {App} from '../App.js'
import Topic from './Topic.jsx'

//supposed to render a single subject w/topics
export class WikiPage extends React.Component{
	constructor(props){
		super(props);
		this.state = ({
			result: [],
			id: 0,
			name: "",
			description: "",
			topics: []
		});
		this.getTopics = this.getTopics.bind(this);
	}

	componentDidMount(){
		this.fetchData("subjects","");
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
			console.log(res);
			// const subjectKeys = Object.keys(res[0]);
			// console.log(subjectKeys);
			this.setState({ 
				result: res,
				id: res[0]["id"],
				name: res[0]["name"],
				description: res[0]["description"],
				topics: res[0]["topics"]});
		}).catch((e) => {console.log(e)});
	}

	getTopics(){
		const topics = this.state.topics;

	}

	render(){
		console.log(this.state.topics);
		if(this.state.result.length > 0){
			const subject = this.state.result[0];
			return(
				<div>
					<App />
					<h1>{this.state.name}</h1>
					<h3>{this.state.description}</h3>
					{
						// this.state.topics.map((topic) =>
						// 	<Topic id={topic["id"]} name={topic["name"]} description={topic["description"]}  />
						// )
					}
				</div>
			);
		}else{
			return (
				<div>
					<div>Fækk Øff</div>
				</div>
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
