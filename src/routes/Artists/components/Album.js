var React = require('react');
var actions = require('../../../actions/AlbumActions');
var ApiUtil = require('../../../utils/ApiUtil');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
//Components
var { Link } = require('react-router');

var Album = React.createClass({
    getInitialState () {
        return { albumDetails: null,
                 detailClasses: ["album-details", "hidden"]
        };
    },
    updateState () {
        this.setState({
            albumDetails: AlbumsStore.getAlbumDetails(this.props.album.id)
        });
    },
    mouseOver () {
        var detailClasses = this.state.detailClasses;
        detailClasses[1] = "";
        this.setState({
            detailClasses: detailClasses
        });
    },
    mouseOut () {
        var detailClasses = this.state.detailClasses;
        detailClasses[1] = "hidden";
        this.setState({
            detailClasses: detailClasses
        });
    },
    render () {
        var album = this.props.album;
        var divStyle = {
            backgroundImage: "url(" + ApiUtil.getAlbumArtUrl(album.coverArt) + ")"
        };
        
        var link = `/artists/${this.props.artistId}/${album.id}`;
        return (
            <Link to={link} >
                <div style={divStyle} 
                     className="album-square album-small" 
                     onMouseOver={this.mouseOver} 
                     onMouseOut={this.mouseOut}>
                    <div className={this.state.detailClasses.join(" ")}>
                        <h5>{album.name}</h5>
                        <span className="artist-name">{album.artist}</span>
                    </div>
                </div>
            </Link>);
    }
});

module.exports = Album