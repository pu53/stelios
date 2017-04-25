import React, { Component } from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router'
import { Search, Grid, Label} from 'semantic-ui-react'
import { getData } from '../helpers.jsx'
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

	
	fetchData() {
		/*uses data offered through props*/
		if(this.props.data !== undefined) {
			this.setState({data:this.props.data});
		}
		/*use the helper method from helpers.jsx to load the data*/
		else {
			let url = 'subjects/?fields=id,name'
			getData(url, ()=>{}, (res)=>{this.setState({data:res})}, ()=>{})
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
			this.resultRenderer = ({ name, id }) => ( 
				<Link to={"/wiki/"+(id+1)}>
					<div style={{'color':'#000000'}}>
						{name}
					</div>
				</Link>);
			return (
			  <Grid>
				<Grid.Column width={16}>
					<Search
					loading={this.state.isLoading}
					onSearchChange={this.handleSearchChange}
					onResultSelect={this.handleResultSelect}
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
							return(<li key={data.id}><Link to={"/wiki/"+data['id']}>{data["name"]}</Link></li>);
						}
					}
					)}
					</ul>
				</div>
			);
		}
	}
}
