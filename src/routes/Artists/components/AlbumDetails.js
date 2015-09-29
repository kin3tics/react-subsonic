var React = require('react');
var actions = require('../../../actions/AlbumActions');
var ApiUtil = require('../../../utils/ApiUtil');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');

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
        if(prevProps.albumId != this.props.albumId)
        {
            this.loadDetails();
        }
      },
    updateState () {
        this.setState({
            albumDetails: AlbumsStore.getAlbumDetails(this.props.albumId)
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
    handleClick (song) {
        actions.playSong(song);
        actions.createTempPlaylist(this.state.albumDetails, song);
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
            details = (
                <div>
                    <div style={blurStyle} className="overlay-blur"></div>
                    <div className="album-details overlay">
                        <div className="title-div">
                            <h4>{album.name}</h4>
                            <span className="artist-name">{album.artist}</span>
                            <br/><span>{album.songCount} Tracks</span>
                        </div>
                        <div className="song-div scrollable">
                            <ol>
                                { album.song.map((song) => { return (<li key={song.id} className="song" onClick={this.handleClick.bind(this, song)}>{ song.title }</li>); }) }
                            </ol>
                        </div>
                    </div>
                </div>);
        }
        return (<div className="album-square album-large" ref="albumDetailsRef">{details}</div>);
    }
});

module.exports = Album