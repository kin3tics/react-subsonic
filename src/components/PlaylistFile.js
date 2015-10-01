var React = require('react');
var PropTypes = React.PropTypes;
var ApiUtil = require('../utils/ApiUtil');
var actions = require('../actions/AlbumActions');
var { ItemTypes } = require('../constants');
var flow = require('lodash/function/flow');
//Stores
var PlaylistStore = require('../stores/PlaylistStore');
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
        actions.playSong(song, this.props.playlistIndex);
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
              onClick={this.handleClick.bind(this, song)}>
              <div className="song-title">{song.title} - { song.artist }</div>
              <div className="song-duration">{duration[0]}:{duration[1]}</div>
          </li>
        ));
    }
});

export default flow(
  DragSource(ItemTypes.AUDIOFILE, fileSource, collect),
  DropTarget(ItemTypes.AUDIOFILE, fileTarget, dropTarget)
)(PlaylistFile);