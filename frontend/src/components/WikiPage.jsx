import React from 'react'
import { WikiNav} from './WikiNav.jsx'
import { Dimmer, Loader } from 'semantic-ui-react'


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
		this.fetchData = this.fetchData.bind(this);
	}

	componentDidMount(){
		this.fetchData("subjects","1");
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
				id: res["id"],
				name: res["name"],
				description: res["description"],
				topics: res["topics"]});
		}).catch((e) => {console.log(e)});
	}

	render(){
		if(Object.keys(this.state.result).length){
			const subject = this.state.result[0];
			return(
				<div>
					<h1>Subject: {this.state.name}</h1>
					<h3>{this.state.description}</h3>
					<br></br>
					<WikiNav topics={this.state.topics} />




				</div>
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
