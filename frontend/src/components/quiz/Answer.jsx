import React, { Component } from 'react';
import './quiz.css'

/*A simple custom button for presenting an answer option. What option is toggled is
 * monitored from the Question owning the answer. The parent question monitores
 * answers via a callback passed through the prop*/
export class Answer extends Component {
	constructor(props) {
		super(props);
		this.state= {
			chosen:false,
			idNum:this.props.opNr,
			text:this.props.text
			};
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange() {
		this.props.toggleCallback(this.state.idNum);
	}

	componentWillMount() {
		if(this.props.curOn === this.state.idNum) {
			this.setState({chosen:true});
		}
		else {
			this.setState({chosen:false});
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.curOn === this.state.idNum) {
			this.setState({chosen:true});
		}
		else {
			this.setState({chosen:false});
		}
	}

	render() {
		var background ='';
		if(this.state.chosen) {
			background='#4C7CFF';
		}
		else {
			background='#68B1FF';
		}

		return (
			<div className="answerWrapper">
				<button className="answerStyle1" style={{backgroundColor:background}} onClick={this.handleChange}>
					<div className="answerStyle2">
						{this.state.text}
					</div>
				</button>
			</div>
			)
	}
}
