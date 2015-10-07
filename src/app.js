var React = require('react');
var { createHashHistory } = require("history");
var { Router, Route } = require('react-router');

const history = createHashHistory({
    getUserConfirmation(message, callback) {
        callback(window.confirm("My Special Window:" + message)) // The default behavior
      }
});

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

React.render(
  <Router history={history} routes={rootRoute} />,
  document.body
);