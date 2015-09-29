var React = require('react');
var update = require('react/lib/update');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
//Stores
var StreamingStore = require('../stores/StreamingStore');
//Components
var PlaylistFile = require('./PlaylistFile');
var { Link } = require('react-router');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd/modules/backends/HTML5');

var PlaylistEditor = React.createClass({
    getInitialState () {
        return { 
            tempPlaylist: [],
            currentPlaying: null,
        };
    },
    moveSong(id, afterId) {
        const { tempPlaylist } = this.state;
    
        const song = tempPlaylist.filter(s => parseInt(s.id) === id)[0];
        const afterSong = tempPlaylist.filter(s => parseInt(s.id) === afterId)[0];
        const songIndex = tempPlaylist.indexOf(song);
        const afterIndex = tempPlaylist.indexOf(afterSong);
    
        this.setState(update(this.state, {
          tempPlaylist: {
            $splice: [
              [songIndex, 1],
              [afterIndex, 0, song]
            ]
          }
        }));
        
        StreamingStore.updatePlaylist(this.state.tempPlaylist);
    },
    componentWillMount () {
        StreamingStore.on('playlist.loaded', this.updateState);
        StreamingStore.on('streaming.ready', this.updateState);
    },
    componentWillUnmount () {
        StreamingStore.off('playlist.loaded', this.updateState);
        StreamingStore.off('streaming.ready', this.updateState);
    },
    componentDidMount() {
        this.updateState();
    },
    componentDidUpdate (prevProps) {
    },
    updateState () {
        this.setState({
            tempPlaylist: StreamingStore.getTempPlaylist(),
            currentPlaying: StreamingStore.getSongToStream()
        });
    },
    render () {
        const { tempPlaylist } = this.state;
        return (
            <ul className='playlist'>
                { tempPlaylist.map((song, i) => {
                    return (
                        <PlaylistFile
                          key={song.id}
                          index={i}
                          id={parseInt(song.id)}
                          song={song}
                          moveFile={this.moveSong} />
                    );
               })} 
            </ul>
            );
        
    }
});

export default DragDropContext(HTML5Backend)(PlaylistEditor);