import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { Home } from './components/Home'
import { WikiPage } from './components/WikiPage'
import '../semantic/dist/semantic.min.css';

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={Home}/>
      <Route path="/wiki" component={WikiPage}></Route>
    </Route>
  </Router>),
  document.getElementById('root')
);
