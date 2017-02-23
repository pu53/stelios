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
      <Route path="/wiki" component={App, WikiPage}/>
      <Route path="/test" component={List} />
      <Redirect from='*' to='/' />
    </Route>
  </Router>),
  document.getElementById('root')
);
