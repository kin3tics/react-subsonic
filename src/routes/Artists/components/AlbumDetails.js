var React = require('react');
var actions = require('../../../actions/AlbumActions');
var ApiUtil = require('../../../utils/ApiUtil');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
var PlaylistStore = require('../../../stores/StreamingStore');
//Components
var AlbumFile = require('./AlbumFile');

var Album = React.createClass({
    getInitialState () {
        return { 
            albumDetails: null,
            width: "100%"
        };
    },
    componentWillMount () {
        AlbumsStore.on('albumDetails.*', this.updateState);
    },
    componentWillUnmount () {
        AlbumsStore.off('albumDetails.*', this.updateState);
    },
    componentDidUpdate (prevProps) {
        if(prevProps.albumId !== this.props.albumId)
        {
            this.loadDetails();
        }
      },
    updateState () {
        this.setState({
            albumDetails: this.orderAlbumSongs(AlbumsStore.getAlbumDetails(this.props.albumId))
        });
    },
    loadDetails () {
        if( this.props.albumId !== null) {
            actions.loadAlbum(this.props.albumId);
        } else {
            this.setState({
                albumDetails: null
            });
        }
    },
    orderAlbumSongs (album) {
        album.song.sort(this.compareSongs);
        return album;
    },
    compareSongs (song_a, song_b) {
        //First Compare Disc Numbers
        if (song_a.discNumber === undefined) { song_a.discNumber = 1; }
        if (song_b.discNumber === undefined) { song_b.discNumber = 1; }
        if(song_a.discNumber < song_b.discNumber) {
            return -1;
        }
        if(song_a.discNumber > song_b.discNumber) {
            return 1;
        }
        //Then Compare Track Numbers
        if(song_a.track < song_b.track) {
            return -1;
        }
        if(song_a.track > song_b.track) {
            return 1;
        }
        return 0;
    },
    handleClick (song) {
        actions.playSong(song);
        actions.createTempPlaylist(this.state.albumDetails.song, song);
    },
    handlePlayAlbum () {
        var songs = this.state.albumDetails.song;
        actions.playSong(songs[0]);
        actions.createTempPlaylist(songs, songs[0]);
    },
    handleQueueAlbum () {
        var playlist = PlaylistStore.getTempPlaylist();
        playlist = playlist.concat(this.state.albumDetails.song);
        PlaylistStore.updatePlaylist(playlist);
    },
    getDurationArray (durationInSeconds) {
        var duration = [0,0];
        duration[0] = Math.floor(durationInSeconds / 60);
        duration[1] = durationInSeconds - (duration[0] * 60);
        duration[1] = duration[1] < 10 ? "0" + duration[1] : duration[1];
        return duration;
    },
    render () {
        var details = "";
        var album = this.state.albumDetails;
        if(album !== null) {
            var blurStyle= {
                backgroundImage: "url(" + ApiUtil.getAlbumArtUrl(album.coverArt) + ")",
                backgroundSize: "100%",
                backgroundRepeat: "no-repeat"
            };
            
            var albumDurationInSeconds = 0;
            var albumFiles = album.song.map((song) => { 
                albumDurationInSeconds += song.duration;
                return (<AlbumFile
                    key = {song.id}
                    song = {song}
                    handleClick = {this.handleClick} />); });
            var albumDuration = this.getDurationArray(albumDurationInSeconds);
            details = (
                <div>
                    <div style={blurStyle} className="overlay-blur"></div>
                    <div className="album-details overlay">
                        <div className="title-div">
                            <h4>{album.name}</h4>
                            <span className="artist-name">{album.artist}</span>
                            <br/><span>{album.song.length} Tracks</span> | <span> {albumDuration[0]}:{albumDuration[1]} </span> | <span title={album.genre}> {album.genre} </span> | <span title="Play Album" className="icon icon-play clickable" onClick={this.handlePlayAlbum}></span> | <span title="Add to Playlist" className="icon icon-queue clickable" onClick={this.handleQueueAlbum}></span>
                        </div>
                        <div className="song-div scrollable">
                            <ul>
                                { albumFiles }
                            </ul>
                        </div>
                    </div>
                </div>);
        }
        return (<div className="album-square album-large" ref="albumDetailsRef">{details}</div>);
    }
});

module.exports = Album