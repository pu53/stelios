import React, { Component } from 'react';

export class SearchBar extends React.Component {
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
	
	fetchData(event) {
		
		this.setState({value: "hei"});
		event.preventDefault();
		
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
		this.setState({value:event.value})
		console.log(this.state.value)
		this.fetchData(event)
	}
	
	render() {
		return (
			<div>
			<div>
				<form onSubmit={this.enterText}>
					<input type="text"></input>
					<input type="submit" value="søk"></input>
				</form>
				<ul>
					<h2> {this.state.value} </h2>
				</ul>
				<List/>
			</div>
			</div>
		);
	}	 
}

class List extends Component {
	constructor(props) {
		super();
		this.state = {
			result: []
		};
		this.fetchData = this.fetchData.bind(this);
	}
	

	componentDidMount() {
	
	}

	fetchData(event) {
		event.preventDefault();
		var link = 'http://localhost:8000/subjects.json';
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
      this.setState({ result: res });
    }).catch((e) => {console.log(e)});
  }

  render() {
    console.log(this.state.result)
    if (this.state.result.length > 0) {
      return (
        <div>
          <button onClick={this.fetchData}>kappa</button>
          <ul>
            { this.state.result.map(function(user){
                return(
                  <ul>
                    {Object.keys(user).map(function (key) {
                      return(
                        <li>{key}:  {user[key].toString()}</li>
                      )
                    })}
                    <br />
                  </ul>
                );
              })
            }
          </ul>
        </div>
      );
    } else {
      return(
        <div>
          <button onClick={this.fetchData}>kappa</button>
          <li>no data recived, click button ples</li>
        </div>

      );
    }
  }
}
