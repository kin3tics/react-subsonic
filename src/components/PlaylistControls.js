var React = require('react');
var update = require('react/lib/update');
var actions = require('../actions/AlbumActions');
var { Events: { ServerPlaylistEvents } } = require('../constants');
//Stores
var PlaylistStore = require('../stores/PlaylistStore');


var PlaylistControls = React.createClass({
    getInitialState () {
        return { 
            showInput: false,
            newName: ""
        };
    },
    handleLoadPlaylists() {
        PlaylistStore.fetchPlaylists();
    },
    handleSavePlaylist() {
        PlaylistStore.saveEditingPlaylistToServer();
    },
    handleSaveNewPlaylist() {
        PlaylistStore.createPlaylist(this.state.newName);
        this.setState({ newName: "", showInput: false });
    },
    handleShowNewPlaylist() {
        this.setState({
            showInput: true
        });
    },
    onNameChange(e) {
        var name = this.state.newName;
        name = e.target.value;
        this.setState({ newName: name });
    },
    render () {
        var newName = "";
        if (this.state.showInput) {
            newName = (<div className="new-playlist input-field">
                  <input id="playlist_name" type="text" onChange={this.onNameChange} />
                  <label htmlFor="playlist_name">Playlist Name</label>
                  <a className="waves-effect waves-light btn" onClick={this.handleSaveNewPlaylist}>Ok</a>
                </div>);
        }
        return (
            <div className="playlist-controls">
                {newName}
                <a className="waves-effect waves-light btn" onClick={this.handleShowNewPlaylist}>New</a>
                <a className="waves-effect waves-light btn" onClick={this.handleLoadPlaylists}>Load</a>
                <a className="waves-effect waves-light btn" onClick={this.handleSavePlaylist}>Save</a>
            </div>
            );
        
    }
});

module.exports = PlaylistControls;