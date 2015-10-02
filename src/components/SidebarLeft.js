var React = require('react');
var actions = require('../actions/AlbumActions');
//Stores
var ArtistsStore = require('../stores/ArtistsStore');
//Components
var Library = require('./Navigation/Library');
var { Link } = require('react-router');

var SidebarLeft = React.createClass({
    render () {
        return (
          <div className="nav-container">
            <div className="menu-bar">
                <span className="icon icon-menu clickable"></span><h5> Library </h5>
            </div>
            <Library />
          </div>
        );
    }
});

module.exports = SidebarLeft;
