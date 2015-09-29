var React = require('react');
var { Router, Route } = require('react-router');
/*var App = require('./components/App');
var ArtistAlbums = require('./components/ArtistAlbums');
var Album = require('./components/Album');

React.render((
  <Router>
    <Route path="/" component={App}>
        <Route path="artists" component={App}>
        <Route path="artists/:artistId" component={ArtistAlbums}>
            <Route path=":albumId" component={Album}>
            </Route>
        </Route>
    </Route>
  </Router>
), document.body)
*/

var rootRoute = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: require('./components/App'),
    childRoutes: [require('./routes/Artists')]
  }]
};

React.render(
  <Router routes={rootRoute} />,
  document.body
);