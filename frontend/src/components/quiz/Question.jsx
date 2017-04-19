import React, { Component } from 'react';
import './quiz.css'
import { Answer } from './Answer.jsx'

/*Representing a single question in a quiz. Manages the answer selection*/
/*-1 is the default value for the chosen answer, and is equivalent to no answer chosen*/
export class Question extends Component {
	constructor(props) {
		super(props);
		this.state= {
			chosenAnswer:-1,
			number:0,
			data: this.props.data,
			firstQuestion:false,
			lastQuestion:false
			};
		this.changeToggle = this.changeToggle.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);
	}

	componentDidMount() {
		this.setState({
			data:this.props.data,
			firstQuestion:this.props.firstQuestion,
			lastQuestion:this.props.lastQuestion,
		});

		if(this.props.chosen !== undefined) {
			this.setState({
				chosenAnswer:this.props.chosen
			});
		}
	}

	changeToggle(id) {
		/*console.log("Callback from" + id);*/
		if(id === this.state.chosenAnswer) {
			this.setState({chosenAnswer:-1});
		}
		else {
			this.setState({chosenAnswer:id});
		}
	}

	nextQuestion() {
		//console.log("internaly chosen: " + this.state.chosenAnswer);
		this.props.onChange(1,this.state.chosenAnswer);
	}

	prevQuestion() {
		//console.log("internaly chosen: " + this.state.chosenAnswer);
		this.props.onChange(-1, this.state.chosenAnswer);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			data:nextProps.data,
			firstQuestion:nextProps.firstQuestion,
			lastQuestion:nextProps.lastQuestion,
			chosenAnswer:nextProps.chosen
		});
	}

	render() {
		/*chechs to see if any of the navbuttons needs adjustment for first/last*/
		/*Nice pale error red:#EF4E45*/
		var nextText='Next';
		var backgroundColor = ''
		var nextCursor = 'default'
		var prevCursor = 'default'
		var visibility = 'visible'
		
		/*defining styles within render like this is probably not great
		 * but for the first draft it's ok*/

		var styleNavButtonPrev= {
			minHeight:'50px',
			backgroundColor:'#6c6c6c',
			color:'#ffffff',
			minWidth:'50%',
			position:'relative',
			display:'flex',
			alignItems:'center',
			borderRadius:'10px',
			visibility:'visible',
			cursor: 'default'
		}
		var styleNavButtonNext= {
			minHeight:'50px',
			backgroundColor:'#6c6c6c',
			color:'#ffffff',
			minWidth:'50%',
			position:'relative',
			display:'flex',
			alignItems:'center',
			borderRadius:'10px'
		}

		/*
		var style3= {
			textAlign:'center',
			width:'100%',
			MozUserSelect:'none',
			WebkitUserSelect:'none',
			MsUserSelect:'none',
			UserSelect:'none'
		};
		*/

		/*chechs to see if any of the navbuttons needs adjustment for first/last*/
		/*Nice pale error red:#EF4E45*/
		var nextText='Next';
		/*var backgroundColor = '#6c6c6c'*/
		/*var cursor = ''*/

		if(this.state.lastQuestion===true) {
			nextText='Finish';
			backgroundColor='#5EBC43';
		}

		if(this.state.firstQuestion===true) {
			prevCursor='default';
		}
		else {
			visibility='visible';
			prevCursor='pointer';
		}

		return (
			<div className="styleQuestion" >
				<div className="styleText" >
					{this.state.data["text"]}
				</div>
				{/*chosen:{this.state.chosenAnswer}*/}
				<div>
					{
						this.state.data.choices.map((choice)=> {
							return(
								<Answer
								key={choice.id}
								opNr={choice.id}
								text={choice.choice_text}
								toggleCallback={this.changeToggle}
								curOn={this.state.chosenAnswer}/>)
						})
					}

					<div className="styleNavButtons" >
						<button className="styleNavButtonPrev" style={{visibility:visibility, cursor:prevCursor}} onClick={this.prevQuestion} disabled={this.state.firstQuestion}>
							<div className="navText">Previous</div>
						</button>
						<button className="styleNavButtonNext" style={{backgroundColor: backgroundColor}} onClick={this.nextQuestion}>
							<div className="navText">{nextText}</div>
						</button>
					</div>
				</div>
			</div>
		)
	}
}
