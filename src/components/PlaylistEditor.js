var React = require('react');
var update = require('react/lib/update');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: { ServerPlaylistEvents } } = require('../constants');
//Stores
var PlaylistStore = require('../stores/PlaylistStore');
//Components
var PlaylistFile = require('./PlaylistFile');
var { Link } = require('react-router');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var PlaylistEditor = React.createClass({
    getInitialState () {
        return { 
            playlistTitle: "Now Playing",
            currentPlaylist: [],
            currentPlaying: null,
            currentPlaylistIndex: -1,
            loadedPlaylists: { active: -1, numLoaded: 0 }
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
        var loadedPlaylists = PlaylistStore.getLoadedPlaylistsSimple();
        PlaylistStore.changeEditingPlaylist(loadedPlaylists.numLoaded - 1);
        this.setState({
            currentPlaylistIndex: loadedPlaylists.numLoaded - 1
        });
        this.updateState();
    },
    loadPlaylist(index) {
        var playlist = PlaylistStore.getPlaylist(index);
        PlaylistStore.changeEditingPlaylist(index);
        this.setState({
            currentPlaylistIndex: index,
            currentPlaylistTitle: playlist.name,
            currentPlaylist: playlist.entry
        });
    },
    updateState () {
        var playlist = PlaylistStore.getPlaylist(this.state.currentPlaylistIndex);
        this.setState({
            currentPlaylistTitle: playlist.name,
            currentPlaylist: playlist.entry,
            currentPlaying: PlaylistStore.getSongToStream(),
            loadedPlaylists: PlaylistStore.getLoadedPlaylistsSimple()
        });
    },
    render () {
        const { currentPlaylist } = this.state;

        return (
            <div>
            <div className='playlist-title'>
                <div>{this.state.currentPlaylistTitle}</div>
                <div className='playlist-indicator-container'>{ [...Array(this.state.loadedPlaylists.numLoaded + 1)].map((x, i) => {
                    var isPlayingClass = "";
                    var indicator = "○";
                    if (i == parseInt(this.state.loadedPlaylists.active) + 1) {
                        isPlayingClass = "playlist-active";
                    }
                    if (i == parseInt(this.state.currentPlaylistIndex) + 1){
                        indicator = "●";
                    }
                    return (<span className={isPlayingClass} key={"playlistactiveindicator_" + i } onClick={this.loadPlaylist.bind(this,(i-1))}>{indicator}</span>);
                })}</div>
            </div>
            <div className="playlist-list-container scrollable">
                <ul className='playlist'>
                    { currentPlaylist.map((song, i) => {
                        var isActive = false;
                        if (song.playlistIndex == this.state.loadedPlaylists.active && song.active) {
                            isActive = true;
                        }
                        return (
                            <PlaylistFile
                              key={song.id}
                              index={i}
                              playlistIndex={this.state.currentPlaylistIndex}
                              id={parseInt(song.id)}
                              song={song}
                              active={isActive}
                              moveFile={this.moveSong} />
                        );
                   })} 
                </ul>
            </div>
            </div>
            );
        
    }
});

export default DragDropContext(HTML5Backend)(PlaylistEditor);