import React from 'react'
import { SearchBar } from './SearchBar'
import './home.css'

/*This is the component containing the home page*/
export class Home extends React.Component {
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
