import React from 'react'
import { UserSubjects } from './UserSubjects'
import { UserQuizes } from './UserQuizes'
import { WelcomeMessage } from './WelcomeMessage'
import { getData } from '../../helpers'

/*Wrapper component for the user page*/
export class UserPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = ({
			data: {},
			userId: localStorage.getItem('stelios_current_user')
		});
	}
	/*Loads data when the component mounts*/
	componentDidMount() {
		if(this.state.userId !== undefined) {
		this.getSubject(this.state.userId)
		}
	}
	
	/*Lambda expression getting userdata using the helper method*/
	getSubject = (id) => {
		var url = "users/data/" + id + "/";
		var handleStatus = (res) => {}
		var handleData = (res) => {
			this.setState({
				data: res
			})
		}
		var handleError = (e) => {}
		getData(url, handleStatus, handleData, handleError)
	}

	render() {
		/*Checks if the component has loaded any data. If not, the component renders
		 * an empty div*/
		if(Object.keys(this.state.data).length > 0){
			return (
				<div style={{width:'100%'}}>
				{/* 'Welcome <username>' */}
				<WelcomeMessage username = {this.state.data.username} />
				{/* list of links to users subjects */}
				<UserSubjects subjects = {this.state.data.subjects} />
				{/* list of links to users quizes */}
				<UserQuizes quizes = {this.state.data.quizes} />
				</div>
			);
		}else{
			return(
				<div></div>
			);
		}
	}
}
