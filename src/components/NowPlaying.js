var React = require('react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: { ServerPlaylistEvents } } = require('../constants');
//Stores
var PlaylistStore = require('../stores/PlaylistStore');
//Components
var PlaylistEditor = require('./PlaylistEditor');
var PlaylistControls = require('./PlaylistControls');
var { Link } = require('react-router');

var NowPlaying = React.createClass({
    getInitialState () {
        return { 
            song: {
                coverArt: null,
                title: "",
                artist: ""
            },
            duration: 0,
            serverPlaylists: null
        };
    },
    componentWillMount () {
        PlaylistStore.on('streaming.preload', this.updateStateLoad);
        PlaylistStore.on('streaming.ready', this.updateStateLoadAndPlay);
        PlaylistStore.on(ServerPlaylistEvents.ALLFETCHED, this.playlistsFetched);
    },
    componentWillUnmount () {
        PlaylistStore.off('streaming.preload', this.updateStateLoad);
        PlaylistStore.off('streaming.ready', this.updateStateLoadAndPlay);
        PlaylistStore.off(ServerPlaylistEvents.ALLFETCHED, this.playlistsFetched);
    },
    componentDidMount () {
        var node = React.findDOMNode(this.refs.audioTracker);
        node.addEventListener('ended', this.getNextTrack);
        node.addEventListener("timeupdate", this.timeUpdate, false);
        node.addEventListener("canplaythrough", this.updateDuration, false);
        window.addEventListener("keydown", this.handleKeyDown, false);  
    },
    handleKeyDown (e) {
        //if spacebar is hit toggle play/pause
        switch (e.keyCode) {
            case 32: //SpaceBar                    
                this.handlePlayPause();
                break;
        }
        return false;
    },
    handleTimelineClick (event) {
        var music = React.findDOMNode(this.refs.audioTracker);
        this.movePlayHead(event);
        music.currentTime = this.state.duration * this.clickPercent(event);  
    },
    handlePlayPause() {
        var node = React.findDOMNode(this.refs.audioTracker);
        var pauseButton = React.findDOMNode(this.refs.playButton);
        if (!node.paused) {
            node.pause();
            pauseButton.className = "icon icon-play-song clickable";
        } else {
            node.play();
            pauseButton.className = "icon icon-pause-song clickable";
        }
    },
    updateDuration() {
        var node = React.findDOMNode(this.refs.audioTracker);
        this.setState({
            duration: node.duration
        });
    },
    movePlayHead (e) {
        var timeline = React.findDOMNode(this.refs.line);
        var playhead = React.findDOMNode(this.refs.playHead);
        var timelineBox = timeline.getBoundingClientRect();
        var newMargLeft = e.pageX - timelineBox.left;
        var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
            playhead.style.marginLeft = newMargLeft + "px";
        }
        if (newMargLeft < 0) {
            playhead.style.marginLeft = "0px";
        }
        if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
        }
    },
    clickPercent(e) {
        var timeline = React.findDOMNode(this.refs.line);
        var timelineBox = timeline.getBoundingClientRect();
        var playhead = React.findDOMNode(this.refs.playHead);
        var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        return (e.pageX - timelineBox.left) / timelineWidth;
    },
    timeUpdate(e) {
        var music = React.findDOMNode(this.refs.audioTracker);
        var playhead = React.findDOMNode(this.refs.playHead);
        var timeline = React.findDOMNode(this.refs.line);
        var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;
        var playPercent = timelineWidth * (music.currentTime / this.state.duration);
        playhead.style.marginLeft = playPercent + "px";
    },
    getPrevTrack() {
        actions.playlistMovePrev();
    },
    getNextTrack() {
        actions.playlistMoveNext();
    },
    updateStateLoad () {
        this.setState({
            song: PlaylistStore.getSongToStream()
        });
        var node = React.findDOMNode(this.refs.audioTracker);
        var pauseButton = React.findDOMNode(this.refs.playButton);
        node.load();
        pauseButton.className = "icon icon-play-song clickable";
    },
    updateStateLoadAndPlay () {
        this.setState({
            song: PlaylistStore.getSongToStream()
        });
        var node = React.findDOMNode(this.refs.audioTracker);
        var pauseButton = React.findDOMNode(this.refs.playButton);
        node.load();
        node.play();
        pauseButton.className = "icon icon-pause-song clickable";
    },
    handleLoadPlaylist(id) {
        PlaylistStore.fetchPlaylist(id);
        this.setState({
            serverPlaylists: null
        });
    },
    playlistsFetched() {
        var playlists = PlaylistStore.getServerPlaylists();
        this.setState({
            serverPlaylists: playlists
        });
    },
    render () {
        var song = this.state.song;
        
        var artistLink = `/artists/${song.artistId}`;
        var albumLink = `${artistLink}/${song.albumId}`;
        
        var playlistArea = "";
        if(this.state.serverPlaylists != null && this.state.serverPlaylists.length > 0) {
            playlistArea = (
                <div>
                <div className="playlist-title">Select a Playlist</div>
                <div className="playlist-list-container scrollable">
                    <ul className="scrollable">
                        { this.state.serverPlaylists.map((playlist) => { return (<li key={"serverPlaylist_" + playlist.id} onClick={this.handleLoadPlaylist.bind(this,playlist.id)}>{playlist.name}</li>); })}
                    </ul>
                </div>
                </div>);
        } else {
           playlistArea = (<div><PlaylistEditor /><PlaylistControls /></div>);
        }
        
        return (
            <div className="now-playing-container">
                <div className="now-playing">
                    <div className="text-center">
                        <Link to={albumLink}><img src={song.coverArt !== null ? ApiUtil.getAlbumArtUrl(song.coverArt) : ""} /></Link>
                        <Link to={albumLink}><h5 title={song.title}>{ song.title.length > 20 ? song.title.substring(0,17) + "..." : song.title }</h5></Link>
                        <Link to={artistLink}><h6>{song.artist}</h6></Link>
                        <div className="audio-controls">
                            <div className="timeline"> 
                                <div className="line" ref="line" onClick={this.handleTimelineClick}></div>
                                <div className="playhead" ref="playHead"></div>
                            </div>
                            <div className="controls">
                                <span className="icon icon-previous-song clickable" onClick={this.getPrevTrack}></span>
                                <span className="icon icon-play-song clickable" ref="playButton" onClick={this.handlePlayPause}></span>
                                <span className="icon icon-next-song clickable" onClick={this.getNextTrack}></span>
                            </div>
                        </div>
                    </div>
                    <audio ref="audioTracker" >
                        <source src={ApiUtil.getStreamingUrl(song.id)} />
                    </audio>
                </div>
                <div className="playlist-container">
                    {playlistArea}
                </div>
            </div>
            );
        
    }
});

module.exports = NowPlaying