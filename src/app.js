var React = require('react');
var { render } = require('react-dom');
//var { createHashHistory } = require ('history');
var { Router, Route, hashHistory } = require('react-router');
var App = require('./components/App');

var rootRoute = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: require('./components/App'),
    childRoutes: [require('./components/Artists'),
                  require('./components/Search'),
                  require('./components/Options')]
  }]
};

render(
  (<Router history={hashHistory} routes={rootRoute} />),
  document.getElementById('ReactSubsonic')
);