var React = require('react');
var actions = require('../actions/AlbumActions');
//Stores
var ArtistsStore = require('../stores/ArtistsStore');
//Components
var Navigation = require("./Navigation");
var NowPlaying = require("./NowPlaying");


var App = React.createClass({
    render () {
        return (
          <div>
          <Navigation />
          <main>
                { this.props.children ? this.props.children : "" }
          </main>
          <NowPlaying />
          </div>
        );
    }
});

module.exports = App;
