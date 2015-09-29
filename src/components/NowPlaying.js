var React = require('react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
//Stores
var StreamingStore = require('../stores/StreamingStore');
//Components
var PlaylistEditor = require('./PlaylistEditor');
var { Link } = require('react-router');

var NowPlaying = React.createClass({
    getInitialState () {
        return { 
            song: {
                coverArt: null,
                title: "",
                artist: ""
            }
        };
    },
    componentWillMount () {
        StreamingStore.on('streaming.preload', this.updateStateLoad);
        StreamingStore.on('streaming.ready', this.updateStateLoadAndPlay);
    },
    componentWillUnmount () {
        StreamingStore.off('streaming.preload', this.updateStateLoad);
        StreamingStore.off('streaming.ready', this.updateStateLoadAndPlay);
    },
    componentDidMount () {
        var node = React.findDOMNode(this.refs.audioTracker);
        node.addEventListener('ended', this.getNextTrack);
        window.addEventListener("keydown", this.handleKeyDown, false);  
    },
    handleKeyDown (e) {
        //if spacebar is hit toggle play/pause
        var node = React.findDOMNode(this.refs.audioTracker);
        switch (e.keyCode) {
            case 32: //SpaceBar                    
                if (!node.paused) {
                    node.pause();
                } else {
                    node.play();
                }
                break;
        }
        return false;
    },
    getNextTrack() {
        actions.playlistMoveNext();
    },
    updateStateLoad () {
        this.setState({
            song: StreamingStore.getSongToStream()
        });
        var node = React.findDOMNode(this.refs.audioTracker);
        node.load();
    },
    updateStateLoadAndPlay () {
        this.setState({
            song: StreamingStore.getSongToStream()
        });
        var node = React.findDOMNode(this.refs.audioTracker);
        node.load();
        node.play();
    },
    render () {
        var song = this.state.song;
        
        return (
            <div className="now-playing-container">
                <div className="now-playing">
                    <div className="text-center">
                        <img src={song.coverArt !== null ? ApiUtil.getAlbumArtUrl(song.coverArt) : ""} />
                        <h5 title={song.title}>{ song.title.length > 20 ? song.title.substring(0,17) + "..." : song.title }</h5>
                        <h6>{song.artist}</h6>
                    </div>
                    <audio controls ref="audioTracker" >
                        <source src={ApiUtil.getStreamingUrl(song.id)} />
                    </audio>
                </div>
                <div className="playlist-container scrollable">
                    <PlaylistEditor />
                </div>
            </div>
            );
        
    }
});

module.exports = NowPlaying