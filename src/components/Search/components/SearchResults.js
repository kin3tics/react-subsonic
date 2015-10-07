var React = require('react');
var ApiUtil = require('../../../utils/ApiUtil');
var { Events: {LibraryEvents } } = require('../../../constants');
var actions = require('../../../actions/AlbumActions');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
var PlaylistStore = require('../../../stores/PlaylistStore');
//Components
var Album = require('../../Artists/components/Album');
var { Link } = require('react-router');

var SearchResults = React.createClass({
    getInitialState () {
        return {
            searchResults: null
        };
    },
    componentWillMount () {
        AlbumsStore.on(LibraryEvents.SEARCHRETURNED, this.loadResults);
    },
    componentWillUnmount () {
        AlbumsStore.off(LibraryEvents.SEARCHRETURNED, this.loadResults);
    },
    loadResults() {
        this.setState({ searchResults: AlbumsStore.getSearchResults() });
    },
    handlePlaySong(song) {
        actions.playSong(song);
        actions.createTempPlaylist([song], song);
    },
    handleQueueSong(song) {
        var playlist = PlaylistStore.getEditingPlaylist();
        playlist.entry.push(song);
        PlaylistStore.updatePlaylist(playlist.entry);
    },
    render() {
        if (this.state.searchResults === null) {
            return null;
        }
        
        var artists = (<li>No Results Found</li>);
        var albums = (<li>No Results Found</li>);
        var songs = (<li>No Results Found</li>);
        if(this.state.searchResults.artist && this.state.searchResults.artist.length > 0) {
            artists = this.state.searchResults.artist.map((a) => { 
                var artistLink = `/artists/${a.id}`;
                return (<li key={"ar_"+a.id}><Link to={artistLink}>{a.name}</Link></li>);
            });
        }
        if(this.state.searchResults.album && this.state.searchResults.album.length > 0) {
            albums = this.state.searchResults.album.map((a) => { 
                return (<Album key={"al_"+a.id} album={a} />);
                var albumImgUrl = ApiUtil.getAlbumArtUrl(a.coverArt);
                var albumLink = `/artists/${a.artistId}/${a.id}`;
                return (<li ><Link to={albumLink}><img src={albumImgUrl} /> {a.name}</Link></li>);
            });
        }
        if(this.state.searchResults.song && this.state.searchResults.song.length > 0) {
            songs = this.state.searchResults.song.map((s) => { 
                var duration = [0,0];
                duration[0] = Math.floor(s.duration / 60);
                duration[1] = s.duration - (duration[0] * 60);
                duration[1] = duration[1] < 10 ? "0" + duration[1] : duration[1];
                return (<li key={"s_"+s.id} className="song">
                        <div className="song-title" onClick={this.handlePlaySong.bind(this, s)}><span className="icon icon-play"></span> { s.title } - { s.artist } </div>
                        <div className="song-duration"><span>{duration[0]}:{duration[1]}</span> | <span title="Add to Playlist" className="icon icon-queue clickable" onClick={this.handleQueueSong.bind(this, s)}></span></div>
                    </li>);
            });
        }
        
        return (
            <div className="search-results-container scrollable">
                <h4>Artists</h4>
                <ul>
                    {artists}
                </ul>
                <h4>Albums</h4>
                <div className="search-results-albums">
                    {albums}
                </div>
                <h4>Songs</h4>
                <ul>
                    {songs}
                </ul>
            </div>
        );
    } 
});

module.exports = SearchResults