var flux = require('flux-react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: {StreamingEvents, PlaylistEvents} } = require('../constants');

var StreamingStore = flux.createStore({
    songToPlay: null,
    tempPlaylist: [],
    actions: [
        actions.playSong,
        actions.createTempPlaylist,
        actions.playlistMoveNext,
        actions.playlistMovePrev
    ],
    playSong (song) {
        this.songToPlay = song;
        this.tempPlaylist.map((playlistSong) => { (playlistSong.id == song.id) ? playlistSong.active = true : playlistSong.active = false });
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit(StreamingEvents.READY);
    },
    createTempPlaylist(songs, songToStream) {
        if (songToStream === null) {
            songToStream = { id: "-1" };
        }
        this.tempPlaylist = songs;
        this.tempPlaylist.map((playlistSong) => { (playlistSong.id == songToStream.id) ? playlistSong.active = true : playlistSong.active = false });
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit(PlaylistEvents.LOADED);
    },
    playlistMoveNext () {
        var index = null;
        this.tempPlaylist.map((playlistSong, i) => { if(playlistSong.active === true) { index = i; }});
        this.tempPlaylist[index].active = false;
        if(index == this.tempPlaylist.length) {
            //end of playlist
            this.songToPlay = null;
        } else {
            index++;
            this.tempPlaylist[index].active = true;
            this.songToPlay = this.tempPlaylist[index];
        }
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit(StreamingEvents.READY);
    },
    playlistMovePrev () {
        var index = null;
        this.tempPlaylist.map((playlistSong, i) => { if(playlistSong.active === true) { index = i; }});
        this.tempPlaylist[index].active = false;
        if(index === 0) {
            //beginning of playlist
            this.songToPlay = null;
        } else {
            index--;
            this.tempPlaylist[index].active = true;
            this.songToPlay = this.tempPlaylist[index];
        }
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit(StreamingEvents.READY);
    },
    loadPlaylistFromStorage () {
        if(this.tempPlaylist.length === 0) {
            //Check localstorage
            if(sessionStorage.currentPlaylist !== undefined) {
                this.tempPlaylist = JSON.parse(sessionStorage.currentPlaylist);
                //Check if any songs should be made ready to stream
                var index = null;
                this.tempPlaylist.map((playlistSong, i) => { if(playlistSong.active === true) { index = i; }});
                if (index !== null) { this.songToPlay = this.tempPlaylist[index]; this.emit("streaming.preload");}
            }
        }
    },
    savePlaylistToStorage(playlist) {
        sessionStorage.currentPlaylist = JSON.stringify(playlist);
    },
    exports: {
        getSongToStream() {
            return this.songToPlay;
        },
        getTempPlaylist() {
            if(this.tempPlaylist.length === 0)
            {
                //attempt to load from sessionStorage
                this.loadPlaylistFromStorage();
            }
            return this.tempPlaylist;
        },
        updatePlaylist(playlist) {
            this.tempPlaylist = playlist;
            this.savePlaylistToStorage(playlist);
            this.emit(PlaylistEvents.RELOAD);
        }
    }
});

module.exports = StreamingStore;