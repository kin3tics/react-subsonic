var React = require('react');
var PropTypes = React.PropTypes;
var ApiUtil = require('../../utils/ApiUtil');
var actions = require('../../actions/AlbumActions');
var { ItemTypes } = require('../../constants');
var _ = require('lodash');
//Stores
var PlaylistStore = require('../../stores/PlaylistStore');
//Components
var { DragSource, DropTarget } = require('react-dnd');

const fileSource = {
    beginDrag (props) {
        return {
            id: props.id,
            index: props.index
        };
    }  
};

const fileTarget = {
    hover(props, monitor, component) {
        //Get contextual data
        const ownId = props.id;
        const draggedId = monitor.getItem().id;
        if (draggedId === ownId) {
            return;
        }
        
        const ownIndex = props.index;
        const draggedIndex = monitor.getItem.index;
        
        //Get DOM Location Info
        const boundingRect = React.findDOMNode(component).getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        const ownMiddleY = (boundingRect.bottom - boundingRect.top) / 2;
        const offsetY = clientOffset.y - boundingRect.top;
        
        //Only change index if move halfway over another element
        if (draggedIndex < ownIndex && offsetY < ownMiddleY) {
          return;
        }
        if (draggedIndex > ownIndex && offsetY > ownMiddleY) {
          return;
        }
        
        //Perform index change
        props.moveFile(draggedId, ownId);
    }  
};

//DnD Bootstrapping
function dropTarget(connect) {
    return { connectDropTarget: connect.dropTarget() };
}

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

var PlaylistFile = React.createClass ({
    propTypes: {
      connectDragSource: PropTypes.func.isRequired,
      isDragging: PropTypes.bool.isRequired,
      moveFile: PropTypes.func.isRequired
    },
    handleClick (song) {
        actions.playSong(song, this.props.playlistId);
    },
    handleRemoveSong () {
        var playlist = PlaylistStore.getEditingPlaylist();
        playlist.entry.splice(this.props.index, 1);
        PlaylistStore.updatePlaylist(playlist.entry);
    },
    handleMouseOver () {
        var node = this.getDOMNode();
        var track = node.getElementsByClassName("duration-text")[0];
        var icon = node.getElementsByClassName("icon-close")[0];
        track.className = "duration-text hidden";
        icon.className = "icon icon-close";
    },
    handleMouseOut () {
        var node = this.getDOMNode();
        var track = node.getElementsByClassName("duration-text")[0];
        var icon = node.getElementsByClassName("icon-close")[0];
        track.className = "duration-text";
        icon.className = "icon icon-close hidden";
    },
    render () {
        var { connectDragSource, isDragging, connectDropTarget } = this.props;
        var song = this.props.song;
        var isActive = this.props.active;
        var classes = [];
        var duration = [0,0];
        duration[0] = Math.floor(song.duration / 60);
        duration[1] = song.duration - (duration[0] * 60);
        duration[1] = duration[1] < 10 ? "0" + duration[1] : duration[1];
        
        if (isActive) { classes.push("current-playing"); }
        if (isDragging) { classes.push("dragging") }
        
        return connectDragSource(connectDropTarget(
          <li className={classes.join(" ")} draggable 
              >
              <div className="song-title" onClick={this.handleClick.bind(this, song)}>{song.title} - { song.artist }</div>
              <div className="song-duration" onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}>
                <div className="duration-text">{duration[0]}:{duration[1]}</div>
                <span className="icon icon-close hidden" onClick={this.handleRemoveSong}></span>
              </div>
          </li>
        ));
    }
});

module.exports = _.flow(
  DragSource(ItemTypes.AUDIOFILE, fileSource, collect),
  DropTarget(ItemTypes.AUDIOFILE, fileTarget, dropTarget)
)(PlaylistFile);