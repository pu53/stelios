import React from 'react'
import { SearchBar } from './SearchBar'
import './home.css'

export class Home extends React.Component {
	constructor(props){
		super(props)
	}
	
	render() {
		return (
			<div className="homeComponentWrapper">
				<div className="contentWrapper">
					<div className="titleWrapper">
						<h1>Welcome to STELIOS!</h1>
						<div>Search for a subject</div>
					</div>
					<div className="searchBarWrapper">
						<SearchBar type="semantic"/>
					</div>
				</div>
			</div>
		);
	}
}
