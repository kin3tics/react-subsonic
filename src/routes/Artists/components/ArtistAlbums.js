var React = require('react');
var ReactPropTypes = React.PropTypes;
var actions = require('../../../actions/AlbumActions');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
//Components
var Album = require('./Album');
var AlbumDetails = require('./AlbumDetails');

var ArtistAlbums = React.createClass({
    getInitialState () {
        return { 
            albums: [],
            artistId: this.props.params.artistId,
            selectedAlbum: null }
    },
    componentWillMount () {
        AlbumsStore.on('albums.*', this.updateState);
    },
    componentWillUnmount () {
        AlbumsStore.off('albums.*', this.updateState);
    },
    componentDidMount() {
        actions.loadAlbums(this.state.artistId);
    },
    componentDidUpdate (prevProps) {
        if(this.props.params.artistId !== this.state.artistId) {
            this.setState({
                albums: [],
                artistId: this.props.params.artistId
            });
            actions.loadAlbums(this.props.params.artistId);
        }
        if(this.props.params.albumId && this.state.selectedAlbum !== this.props.params.albumId)
        {
            this.setState({
                selectedAlbum: this.props.params.albumId
            });
        }
      },
    updateState () {
        this.setState({
            albums: AlbumsStore.getAlbums(this.state.artistId)
        });
    },
    render () {
        var album = this.state.selectedAlbum;
        return (
            <div>
                <div className="row album-selected"><AlbumDetails albumId={ album != null ? album : null } /></div>
                <div className="row album-list scrollable">{ this.state.albums.map((album) => { return (<Album key={album.id} album={album} artistId={this.state.artistId} />); }) }</div>
            </div>
        );
    }
});

module.exports = ArtistAlbums