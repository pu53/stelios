import React, { Component } from 'react';
import { Table, Label } from 'semantic-ui-react'
import { getData } from '../../helpers.jsx' 
import './quiz_statistics.css'

/*
 * A component containing a table/graph containing data from a specific quiz
 */
export class QuizStatistics extends Component {
	constructor(props) {
		super();
		this.state={
			id:-1,
			title :'No Title Found',
			data:{},
			statusMsg:''
		};
	}
	
	componentWillMount() {
		this.fetchData();
	}
	
	/* Requests statistical data from the server. If the user is not authenticicated,
	 * an error flag will be set accordingly */
	fetchData() {
		let userId = localStorage.getItem('stelios_current_user')
		if(userId === 'null')
			return;
		
		//Fetches data from the correct api endpoint and loads it into state
		let url = "result/stats/"+this.props.metric+"/"+this.props.scope+"/"+this.props.statId+"/";
		getData(
			url,
			(res)=>{
				this.setState({
					statusMsg:res
				})
			},
			(res)=>{
				this.setState({
					data:res}, 
					()=>{
					/* This setState is set to be called after the one directly
					 * above, to ensure that this.state.data actually contains
					 * anything first */
					this.setState({
						title: this.state.data.title,
						id: this.state.data.id
					})
				})
			},
			()=>{});
		
	}
	checkLoggedIn() {
		if(localStorage.getItem('stelios_current_user') === 'null'){
			return(<div> You are currently not logged in. </div>)
		}
		else {
			this.fetchData()
		}
	}
	
	//Generates the entire table view
	generateTable(type) {
		if(this.state.data.length !==0){
			return(
			<div className="singleTableWrapper">
				<Table celled unstackable>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Header</Table.HeaderCell>
							<Table.HeaderCell>Header</Table.HeaderCell>
							<Table.HeaderCell>Header</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						<Table.Row>
							<Table.Cell>
								<Label>First</Label>
							</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
						</Table.Row>
						<Table.Row>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
							<Table.Cell>Cell</Table.Cell>
						</Table.Row>
					</Table.Body>
				</Table>
			</div>
			);
		}
		
		else {
			return<div className="loadingText">loading data...</div>
		}
	}
	
	render() {
		/* Checks whether the current user has been authorized 
		 * before trying to display the stats
		 */
		if(this.state.statusMsg.ok === true){
			return(
			<div>
				<div className="mainTitle">
					Statistics for quiz nr. {this.state.id}:
					<br/>
					{this.state.data.title}
				</div>
				
				<div className="tableContainerWrapper" key = {this.state.data}>
					Statistics!
					{this.generateTable(this.props.type)}
				</div>
			</div>
			)
		}
		
		//If the user was not allowed to view the data, an error message is displayed
		return(
			<div className="statPageWrapper">
				<div className="notAuthMsg">
					Sorry, you are not permitted to view the statistics for this quiz.
					<br/>
					{this.checkLoggedIn()}
				</div>
			</div>
		);
	}
}
