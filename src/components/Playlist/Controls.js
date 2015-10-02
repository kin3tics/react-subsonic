var React = require('react');
var update = require('react/lib/update');
var actions = require('../../actions/AlbumActions');
var { Events: { ServerPlaylistEvents } } = require('../../constants');
//Stores
var PlaylistStore = require('../../stores/PlaylistStore');


var PlaylistControls = React.createClass({
    getInitialState () {
        return { 
            newName: "",
            serverPlaylists: [],
            editingPlaylist: PlaylistStore.getEditingPlaylist()
        };
    },
    componentWillMount () {
        PlaylistStore.on(ServerPlaylistEvents.ALLFETCHED, this.playlistsFetched);
    },
    componentWillUnmount () {
        PlaylistStore.off(ServerPlaylistEvents.ALLFETCHED, this.playlistsFetched);
    },
    handleLoadPlaylists() {
        PlaylistStore.fetchPlaylists();
    },
    handleLoadPlaylist(id) {
        PlaylistStore.fetchPlaylist(id);
        this.setState({
            serverPlaylists: null
        });
        this.props.handleBackClick();
    },
    handleSavePlaylist() {
        PlaylistStore.saveEditingPlaylistToServer();
        this.props.handleBackClick();
    },
    handleSaveNewPlaylist() {
        PlaylistStore.createPlaylist(this.state.newName);
        this.setState({ newName: "" });
        this.props.handleBackClick();
    },
    handleRemovePlaylist() {
        PlaylistStore.removePlaylist(this.state.editingPlaylist.id);
        this.props.handleBackClick();
    },
    handleDeletePlaylist() {
        PlaylistStore.deletePlaylist(this.state.editingPlaylist.id);
        this.props.handleBackClick();
    },
    playlistsFetched() {
        var playlists = PlaylistStore.getServerPlaylists();
        this.setState({
            serverPlaylists: playlists
        });
    },
    onNameChange(e) {
        this.setState({ newName: e.target.value });
    },
    render () {
        var serverPlaylists = "";
        
        if(this.state.serverPlaylists.length > 0) {
            serverPlaylists = (
                <ul>
                    { this.state.serverPlaylists.map((playlist) => { return (<li key={"serverPlaylist_" + playlist.id} onClick={this.handleLoadPlaylist.bind(this,playlist.id)}>{playlist.name}</li>); })}
                </ul>);
        }
        
        return (
            <div className="playlist-controls">
                <span className="icon icon-chevron-left clickable playlist-back-btn" onClick={this.props.handleBackClick}></span>
                <div className="playlist-title">Playlist Settings</div>
                <div className="playlist-list-container scrollable"><div>
                    <span className="icon icon-create"></span><span> Create New</span>
                    <div className="new-playlist input-field">
                      <input id="playlist_name" type="text" value={this.state.newName} onChange={this.onNameChange} ref="newPlaylistInput" />
                      <span className="icon icon-send clickable" onClick={this.handleSaveNewPlaylist} title="Create"></span>
                    </div>
                </div>
                <div>
                    <div className="clickable" onClick={this.handleLoadPlaylists}>
                        <span className="icon icon-add"></span>
                        <div><span> Load Playlist From Server</span></div>
                    </div>
                    <div className="loaded-playlists">
                        {serverPlaylists}
                    </div>
                </div>
                <div>
                    { (this.state.editingPlaylist.id >= 0)
                        ? (<div className="clickable" onClick={this.handleSavePlaylist}>
                            <span className="icon icon-save"></span>
                            <div><span> Save "{this.state.editingPlaylist.name}" To Server</span></div></div>)
                        : ""
                    }
                </div>
                <div>
                    { (this.state.editingPlaylist.id >= 0)
                        ? (<div className="clickable" onClick={this.handleRemovePlaylist}>
                            <span className="icon icon-remove"></span>
                            <div><span> Remove "{this.state.editingPlaylist.name}" From List</span></div></div>)
                        : ""
                    }
                </div>
                <div>
                    { (this.state.editingPlaylist.id >= 0)
                        ? (<div className="clickable" onClick={this.handleDeletePlaylist}>
                        <span className="icon icon-delete"></span>
                        <div><span> Delete "{this.state.editingPlaylist.name}" From Server</span></div></div>)
                        : ""
                    }
                </div>
                </div>
            </div>
            );
        
    }
});

module.exports = PlaylistControls;