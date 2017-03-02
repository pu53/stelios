import React from 'react';
import ReactDOM from 'react-dom';
import {App, List} from './App';
import './index.css';
import { Router, Route, browserHistory, IndexRoute, Redirect} from 'react-router'
import { Home } from './components/Home'
import { WikiPage } from './components/WikiPage'
import '../semantic/dist/semantic.min.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/wiki" component={WikiPage}>
	       <Route path="/wiki/:subjectId" component={WikiPage}>
           <Route path="/wiki/:subjectId/:topicId" component={WikiPage} />
	       </Route>
      </Route>
      <Route path="/test" component={List} />
      <Route path="*" component={Home} />
    </Route>
  </Router>),
  document.getElementById('root')
);
