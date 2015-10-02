var React = require('react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: { ServerPlaylistEvents } } = require('../constants');
//Stores
var PlaylistStore = require('../stores/PlaylistStore');
//Components
var NowPlaying = require('./NowPlaying');
var PlaylistContainer = require('./Playlist/Container');

var SidebarRight = React.createClass({
    render () {
        return (
            <div className="now-playing-container">
                <NowPlaying />
                <PlaylistContainer />
            </div>
            );
        
    }
});

module.exports = SidebarRight