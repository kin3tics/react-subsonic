var React = require('react');
var actions = require('../../actions/AlbumActions');
var ApiUtil = require('../../utils/ApiUtil');
var { Events: { ServerPlaylistEvents } } = require('../../constants');
//Stores
var PlaylistStore = require('../../stores/PlaylistStore');
//Components
var PlaylistEditor = require('./Editor');
var PlaylistControls = require('./Controls');
var { Link } = require('react-router');

var PlaylistContainer = React.createClass({
    getInitialState () {
        return {
            showOptions: false
        };
    },
    handleShowOptions() {
        this.setState({
            showOptions: true
        });
    },
    handleHideOptions() {
        this.setState({
            showOptions: false
        });
    },
    render () {
        var playlistArea = "";
        if(this.state.showOptions) {
            playlistArea = (<PlaylistControls handleBackClick={this.handleHideOptions} />);
        } else {
           playlistArea = (<PlaylistEditor handleOptionsClick={this.handleShowOptions}/>);
        }
        
        return (
            <div className="playlist-container">
                {playlistArea}
            </div>
            );
        
    }
});

module.exports = PlaylistContainer