import React, { Component } from 'react';
import { Link } from 'react-router';
export class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state={pressed:false,
					value: '',
					id: [],
					name: []
					};
					
		this.fetchData = this.fetchData.bind(this);
		this.enterText = this.enterText.bind(this);
	}
	
	componentDidMount() {
		this.fetchData();
	}
	
	fetchData() {
		console.log('halla')
		
		var link = 'http://localhost:8000/subjects/';
		var request = new Request(link, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
			},
		});
		
		console.log("yes");
		fetch(request).then((res) => {
			return res.json();
		})
		.then((res) => {
		console.log(res);
		
		var idArr = [];
		for( var i = 0; i < res.length; i++){
			idArr.push(res[i]["id"]);
		}
		
		var nameArr = [];
		for( var i = 0; i < res.length; i++){
			nameArr.push(res[i]["name"]);
		}
		
		this.setState({
			id: idArr,
			name: nameArr
			});
		}).catch((e) => {console.log(e)});
		console.log(this.state);
	}
	
	enterText(event) {
		this.setState({value:event.target.value})
	}
	
	render() {
		return (
			<div>
			<div>
				<form onSubmit={this.enterText}>
					<input type="text" onChange={this.enterText}></input>
				</form>
				<ul>
					{this.state.name.map((user) => {
					var link = "/wiki/subjects";
						if(this.state.value != "" && user.toUpperCase().search(this.state.value.toUpperCase()) != -1) {
							return(<li><Link to="/wiki/subjects" activeStyle={{color:"red"}}>{user}</Link></li>);
						}
					})}
					<h2> {this.state.value} </h2>
				</ul>
			</div>
			</div>
		);
	}	 
}

