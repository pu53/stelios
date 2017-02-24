import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { Search, Grid, Header, Label } from 'semantic-ui-react'
import _ from 'lodash'

export class SearchBarNotCustom extends Component {
	constructor(props) {
		super(props);
		this.state = ({
					pressed:false,
					data: [],
					isLoading: false,
					value: '',
					results: []
				});

		this.fetchData = this.fetchData.bind(this);
		this.enterText = this.enterText.bind(this);
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		console.log('halla')
		var link = '';
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://api.stelios.no/subjects/?fields=id,name'
		// dev code
		} else {
			link = 'http://api.stelios.no/subjects/?fields=id,name'
		// production code
		}
		var request = new Request(link, {
			method: 'GET',
			headers: {
							'Accept': 'application/json',
					},
		});

		fetch(request).then((res) => {
			console.log(res);
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

	handleClick(id) {
		browserHistory.push("/wiki/" + id);
	}

	componentWillMount() {
    this.resetComponent()
  }
	//taken from http://react.semantic-ui.com/modules/search#category
  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

  handleResultSelect = (e, result) => {
		console.log("puush", result);
		browserHistory.push("/wiki/" + result.id);
		window.location.reload()
	}

	handleSearchChange = (e, value) => {
     this.setState({ isLoading: true, value: value})

     setTimeout(() => {
       if (this.state.value.length < 1) return this.resetComponent()
       const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
       const isMatch = (result) => re.test(result.name)
       this.setState({
         isLoading: false,
         results: _.filter(this.state.data, isMatch),
       })
			 console.log(this.state.results);
     }, 10)
   }

	render() {

    return (
      <Grid>
        <Grid.Column width={16}>
					<Search
            loading={this.state.isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={this.state.results}
            value={this.state.value}
						input={{ fluid: true }}
            {...this.props}
          />
        </Grid.Column>
			</Grid>
		);
	}
}

export class SearchBar extends Component {

	resultRenderer = ({ name, id }) => ( <Label content={name} /> );
	render(){
		this.resultRenderer.propTypes = {
		  id: PropTypes.string,
		  name: PropTypes.string,
		}
		return(
			<SearchBarNotCustom resultRenderer={this.resultRenderer} />
		);
	}
}
/*
<div>
	<form onSubmit={this.enterText}>
		<input type="text" onChange={this.enterText}></input>
	</form>
	<ul>
		{this.state.data.map((user) => {
			var link = "/wiki/".concat(user['id']);
			if(this.state.value !== "" && user["name"].toUpperCase().search(this.state.value.toUpperCase()) !== -1) {
				return(<li><a href="" onClick={() => this.handleClick(user['id'])}>{user["name"]}</a></li>);
			}
		}
		)}
	</ul>
</div>

*/
