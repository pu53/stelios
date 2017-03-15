import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { Search, Grid, Header, Label } from 'semantic-ui-react'
import _ from 'lodash'

export class SearchBar extends Component {
	constructor(props) {
		super(props);
		this.state = ({
			pressed:false,
			data: [],
			isLoading: false,
			value: '',
			customRenderer: false
			});
			
		this.fetchData = this.fetchData.bind(this);
		this.enterText = this.enterText.bind(this);
	}
	
	/*Runs on component load*/
	componentDidMount() {
		this.fetchData();
		/*fetching potential custom resultRenderer*/
		this.resultRenderer;
		if(this.props.resultRenderer !== undefined) {
			this.setState({customRenderer: true});
		}
	}
	
	/*TODO: Implement several fetchmodes to allow for more flexible search fields.
	 *Let users specify what data they are looking for in the props, through 
	 *sending data directly/using built in templates to have the component query for
	 *data on it's own. Direct data takes priority over templates, that is, if
	 *the "data" prop is defined, the component will display this data exclusivly.
	 *Relevant props: type, data, template*/
	fetchData() {
		console.log("Fetching data to search field")
		/*Link path in 3 parts: the host + the table + the fields*/
		var link = '';
		
		/*Setting host*/
		var host = '';
		if(!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			host = 'http://localhost:8000';
		}
		else {
			host ='http://api.stelios.no';
		}
		/*uses data offered through props*/
		if(this.props.data !== undefined) {
			this.setState({data:this.props.data});
		}
		
		/*using templates to define a database query*/
		else {
			 var table  = "";
		var fields = "";
		var template = this.props.template;
		
		/*checking template and fetches data defined by template*/
		if(this.props.template !== undefined) {
			console.log("found template!")
			if(template === "subjects") {
				table  = "subjects";
				fields = "id,name";
			}
			
			if(template === "topic_filter") {
				table = "topics";
				fields = "id,name";
			}
		}
		
		link = host+"/"+table+"?fields="+fields;
		console.log("Link = "+link);
		
		/*
		if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
			link = 'http://localhost:8000/subjects/?fields=id,name'
		// dev code
		} else {
			link = 'http://api.stelios.no/subjects/?fields=id,name'
		// production code
		}*/
		
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
		
		this.setState({
			data:res
			});
		}).catch((e) => {console.log(e)});
		}
	}
	//taken from http://react.semantic-ui.com/modules/search#category
	resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })
	
	handleResultSelect = (e, result) => {
		browserHistory.push("/wiki/" + result.id);
		window.location.reload();
	}
	
	enterText(event) {
		this.setState({value:event.target.value})
	}
	
	handleClick(id) {
		browserHistory.push("/wiki/" + id);
		window.location.reload();
	}
	
	componentWillMount() {
	this.resetComponent()
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
		if(this.props.type === "semantic") {
			this.resultRenderer = ({ name, id }) => ( <Label content={name} /> );
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
					resultRenderer={this.resultRenderer}
					{...this.props}
				  />
				</Grid.Column>
					</Grid>
				);
		}
		
		else if(this.props.type === "filter") {
			return(
				<div>
					<form>
						<input type="text" onChange={this.enterText}></input>
					</form>
					
					<ul> {
						this.state.data.map((data) => {
						var link = "/wiki/".concat(data['id']);
						const re = new RegExp(_.escapeRegExp(this.state.value).toUpperCase(), 'i');
						if(this.state.value === "" || (this.state.value !== "" && data["name"].toUpperCase().search(re) !== -1)) {
							return(<li key={data.id}><a href="" onClick={() => this.handleClick(data['id'])}>{data["name"]}</a></li>);
						}
					}
					)}
					</ul>
				</div>
			);
		}
	}
}

