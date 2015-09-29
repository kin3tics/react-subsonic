var flux = require('flux-react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');

var StreamingStore = flux.createStore({
    songToPlay: null,
    tempPlaylist: [],
    actions: [
        actions.playSong,
        actions.createTempPlaylist,
        actions.playlistMoveNext
    ],
    playSong (song) {
        this.songToPlay = song;
        this.tempPlaylist.map((playlistSong) => { (playlistSong.id == song.id) ? playlistSong.active = true : playlistSong.active = false });
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit("streaming.ready");
    },
    createTempPlaylist(album, song) {
        if (song === null) {
            song = { id: "-1" };
        }
        this.tempPlaylist = album.song;
        this.tempPlaylist.map((playlistSong) => { (playlistSong.id == song.id) ? playlistSong.active = true : playlistSong.active = false });
        this.savePlaylistToStorage(this.tempPlaylist);
        this.emit("playlist.loaded");
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
        this.emit("streaming.ready");
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
        }
    }
});

module.exports = StreamingStore;