var React = require('react');
var update = require('react/lib/update');
var actions = require('../../actions/AlbumActions');
var ApiUtil = require('../../utils/ApiUtil');
var { Events: { ServerPlaylistEvents } } = require('../../constants');
//Stores
var PlaylistStore = require('../../stores/PlaylistStore');
//Components
var PlaylistFile = require('./File');
var { Link } = require('react-router');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var PlaylistEditor = React.createClass({
    getInitialState () {
        var editingPlaylist = PlaylistStore.getEditingPlaylist();
        return { 
            playlistTitle: "Now Playing",
            currentPlaylist: [],
            currentPlaying: null,
            currentPlaylistId: editingPlaylist.id,
            loadedPlaylists: { active: -1, loaded: [] }
        };
    },
    moveSong(id, afterId) {
        const { currentPlaylist } = this.state;
    
        const song = currentPlaylist.filter(s => parseInt(s.id) === id)[0];
        const afterSong = currentPlaylist.filter(s => parseInt(s.id) === afterId)[0];
        const songIndex = currentPlaylist.indexOf(song);
        const afterIndex = currentPlaylist.indexOf(afterSong);
    
        this.setState(update(this.state, {
          currentPlaylist: {
            $splice: [
              [songIndex, 1],
              [afterIndex, 0, song]
            ]
          }
        }));
        
        PlaylistStore.updatePlaylist(this.state.currentPlaylist);
    },
    componentWillMount () {
        PlaylistStore.on('playlist.*', this.updateState);
        PlaylistStore.on('streaming.ready', this.updateState);
        PlaylistStore.on(ServerPlaylistEvents.SINGLEFETCHED, this.loadLatestPlaylist);
    },
    componentWillUnmount () {
        PlaylistStore.off('playlist.*', this.updateState);
        PlaylistStore.off('streaming.ready', this.updateState);
        PlaylistStore.off(ServerPlaylistEvents.SINGLEFETCHED, this.loadLatestPlaylist);
    },
    componentDidMount() {
        this.updateState();
    },
    componentDidUpdate (prevProps) {
    },
    loadLatestPlaylist () {
        var loadedPlaylist = PlaylistStore.getEditingPlaylist();
        this.setState({
            currentPlaylistId: loadedPlaylist.id
        });
        this.updateState();
    },
    loadPlaylist(id) {
        var playlist = PlaylistStore.getPlaylist(id);
        PlaylistStore.changeEditingPlaylist(id);
        this.setState({
            currentPlaylistId: playlist.id,
            currentPlaylistTitle: playlist.name,
            currentPlaylist: playlist.entry
        });
    },
    updateState () {
        var playlist = PlaylistStore.getPlaylist(this.state.currentPlaylistId);
        this.setState({
            currentPlaylistTitle: playlist.name,
            currentPlaylist: playlist.entry,
            currentPlaying: PlaylistStore.getSongToStream(),
            loadedPlaylists: PlaylistStore.getLoadedPlaylistsSimple()
        });
    },
    render () {
        const { currentPlaylist } = this.state;
        var playlistTotalDuration = 0;
        var playlistTracks = [];
        currentPlaylist.map((song, i) => {
            playlistTotalDuration += song.duration;
            var isActive = false
            if (song.playlistId == this.state.loadedPlaylists.active && song.active) {
                isActive = true;
            }
            playlistTracks.push( (
                <PlaylistFile
                  key={song.id}
                  index={i}
                  playlistId={this.state.currentPlaylistId}
                  id={parseInt(song.id)}
                  song={song}
                  active={isActive}
                  moveFile={this.moveSong} />
            ) );
        });
        var duration = [0,0];
        duration[0] = Math.floor(playlistTotalDuration / 60);
        duration[1] = playlistTotalDuration - (duration[0] * 60);
        duration[1] = duration[1] < 10 ? "0" + duration[1] : duration[1];
        
        return (
            <div>
            <div className='playlist-title'>
                <div>{this.state.currentPlaylistTitle}</div>
                <div className='playlist-indicator-container'>{ [-1,...this.state.loadedPlaylists.loaded].map((playlistId, i) => {
                    var isPlayingClass = "";
                    var indicator = "○";
                    if (playlistId == this.state.loadedPlaylists.active) {
                        isPlayingClass = "playlist-active";
                    }
                    if (playlistId == this.state.currentPlaylistId) {
                        indicator = "●";
                    }
                    return (<span className={isPlayingClass} key={"playlistactiveindicator_" + i } onClick={this.loadPlaylist.bind(this,(playlistId))}>{indicator}</span>);
                })}</div>
                <span className="icon icon-options clickable playlist-options-btn" onClick={this.props.handleOptionsClick}></span>
            </div>
            <div className="playlist-list-container scrollable">
                <ul className='playlist'>
                    {playlistTracks}
                </ul>
            </div>
            <div className="playlist-overview">
                <div className="song-title">{currentPlaylist !== undefined ? currentPlaylist.length : 0} Tracks</div>
                <div className="song-duration">
                    <div className="duration-text">{duration[0]}:{duration[1]}</div>
                </div>
            </div>
            </div>
            );
        
    }
});

export default DragDropContext(HTML5Backend)(PlaylistEditor);