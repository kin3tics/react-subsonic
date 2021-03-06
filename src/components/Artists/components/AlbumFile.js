var React = require('react');
var ReactDOM = require('react-dom');
var actions = require('../../../actions/AlbumActions');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
var PlaylistStore = require('../../../stores/PlaylistStore');

var AlbumFile = React.createClass({
    componentDidUpdate (prevProps) {
    },
    handleQueueSong (song) {
        var playlist = PlaylistStore.getEditingPlaylist();
        playlist.entry.push(song);
        PlaylistStore.updatePlaylist(playlist.entry);
    },
    getDurationArray (durationInSeconds) {
        var duration = [0,0];
        duration[0] = Math.floor(durationInSeconds / 60);
        duration[1] = durationInSeconds - (duration[0] * 60);
        duration[1] = duration[1] < 10 ? "0" + duration[1] : duration[1];
        return duration;
    },
    handleMouseOver () {
        var node = ReactDOM.findDOMNode(this);
        var track = node.getElementsByClassName("song-track")[0];
        var icon = node.getElementsByClassName("icon-play")[0];
        track.className = "song-track hidden";
        icon.className = "icon icon-play";
    },
    handleMouseOut () {
        var node = ReactDOM.findDOMNode(this);
        var track = node.getElementsByClassName("song-track")[0];
        var icon = node.getElementsByClassName("icon-play")[0];
        track.className = "song-track";
        icon.className = "icon icon-play hidden";
    },
    render () {
        var song = this.props.song;
        var songDuration = this.getDurationArray(song.duration);
        return (
            <li key={song.id} className="song">
                <div className="song-title" onClick={this.props.handleClick.bind(null, song)} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}><span className="song-track">{song.track}.</span><span className="icon icon-play hidden"></span> { song.title }</div>
                <div className="song-duration"><span>{songDuration[0]}:{songDuration[1]}</span> | <span title="Add to Playlist" className="icon icon-queue clickable" onClick={this.handleQueueSong.bind(this, song)}></span></div>
            </li>);
    }
});

module.exports = AlbumFile