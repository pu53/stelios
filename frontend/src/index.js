import React from 'react';
import ReactDOM from 'react-dom';
import {App, List} from './App';
import './index.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { Home } from './components/Home'
import { WikiPage } from './components/wiki/WikiPage'
import { UserPage } from './components/user/UserPage'
import { QuizPage } from './components/quiz/QuizPage'
import { StatPage } from './components/stat/StatPage'
import '../semantic/dist/semantic.min.css';

/*This is where the react renderer receives the data it renders,
 *and where the react routers are set up*/
ReactDOM.render((
	<Router history={browserHistory}>
		<Route path="/" component={App}>
		<IndexRoute component={Home}/>
		<Route path="/wiki" component={WikiPage}>
			<Route path="/wiki/:subjectId" component={WikiPage}>
				<Route path="/wiki/:subjectId/:topicId" component={WikiPage} />
			</Route>
		</Route>
		<Route path="/quiz" component={QuizPage}>
			<Route path="/quiz/:quizId"/>
		</Route>
		<Route path="/test" component={List} />
		<Route path="/user" component={UserPage} />
		<Route path="/stat" component={StatPage}>
			<Route path="/stat/quiz/:statId"/>
		</Route>
		<Route path="*" component={Home} />
		</Route>
	</Router>),
	document.getElementById('root'))
