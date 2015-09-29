var React = require('react');
var actions = require('../actions/AlbumActions');
//Stores
var ArtistsStore = require('../stores/ArtistsStore');
//Components
var { Link } = require('react-router');

var Navigation = React.createClass({
    getInitialState () {
        return { artists: ArtistsStore.getArtists() }
    },
    componentWillMount () {
        ArtistsStore.on('artists.*', this.updateState);
    },
    componentWillUnmount () {
        ArtistsStore.off('artists.*', this.updateState);
    },
    componentDidMount () {
        actions.loadArtists();  
    },
    updateState () {
        this.setState({
            artists: ArtistsStore.getArtists()
        });
    },
    scrollToRef (index) {
        var node = React.findDOMNode(this.refs[index]);
        node.scrollIntoView();
    },
    render () {
        var artists = "";
        var indexes = "";
        if (this.state.artists.index !== undefined) {
            // index => artists grouped (A, B, C, ...)
            artists = this.state.artists.index.map((index) => { 
                return (
                    <div key={index.name} ref={index.name}><h4>{index.name}</h4><ul>
                    { index.artist.map((artist) => {
                        var link = `/artists/${artist.id}`;
                        //if name is too long shorten it
                        var text = artist.name.length > 20 ? artist.name.substring(0,17) + "..." : artist.name;
                        return (
                            <li key={artist.id}>
                                <Link to={link} className="collection-item">{ text }</Link>
                            </li>);
                     })}
                    </ul></div>); 
            });
            indexes = this.state.artists.index.map((index) => { 
                return (
                    <span key={ "idx" + index.name } onClick={this.scrollToRef.bind(this, index.name)}> {index.name} </span>); 
            });
        }
    
        return (
          <div className="side-nav fixed">
            <div className="artist-list scrollable">
                { artists }
            </div>
            <div className="indexes">
                { indexes }
            </div>
          </div>
        );
    }
});

module.exports = Navigation;
