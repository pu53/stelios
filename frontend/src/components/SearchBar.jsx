import React, { Component } from 'react';
import { Link } from 'react-router';
export class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state={pressed:false,
					value: '',
					data: []
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
			data:res
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
				<form onSubmit={this.enterText}>
					<input type="text" onChange={this.enterText}></input>
				</form>
				<ul>
					{this.state.data.map((user) => {							
						
						var link = "/wiki/".concat(user['id']);
						if(this.state.value !== "" && user["name"].toUpperCase().search(this.state.value.toUpperCase()) !== -1) {
							return(<li><Link to={link} activeStyle={{color:"red"}}>{user["name"]}</Link></li>);
						}
					}
					)}
				</ul>
			</div>
			
		);
	}	 
}

