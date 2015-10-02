var flux = require('flux-react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: {StreamingEvents, PlaylistEvents, ServerPlaylistEvents } } = require('../constants');

var PlaylistStore = flux.createStore({
    songToPlay: null,
    nowPlayingPlaylist: [], //Tracks currently playing
    loadedPlaylists: [], //Array of server-loaded playlists
    //Playlist currently "active":
    //  -1  = nowPlaying
    //   0+ = Index of loadedPlaylists
    activePlaylist: -1,
    editingPlaylist: -1,
    serverPlaylists: [],
    
    actions: [
        actions.playSong,
        actions.createTempPlaylist,
        actions.playlistMoveNext,
        actions.playlistMovePrev,
        actions.playlistsFetched,
        actions.playlistFetched,
        actions.playlistUpdated,
        actions.playlistDeleted,
        actions.playlistCreated
    ],
    playSong (song, playlistId) {
        if(playlistId !== undefined && playlistId >= 0) {
            this.activePlaylist = playlistId;
        } else {
            this.activePlaylist = -1;
        }
        var playlist = this.getPlaylistById(this.activePlaylist).entry;
        this.songToPlay = song;
        playlist.map((playlistSong) => { (playlistSong.id == song.id) ? playlistSong.active = true : playlistSong.active = false });
        if (this.activePlaylist == -1) { this.savePlaylistToStorage(playlist); }
        this.emit(StreamingEvents.READY);
    },
    createTempPlaylist(songs, songToStream) {
        this.nowPlayingPlaylist = this.initializePlaylist(songs, songToStream, -1);
        this.savePlaylistToStorage(this.nowPlayingPlaylist);
        this.emit(PlaylistEvents.LOADED);
    },
    initializePlaylist(songs, songToStream, playlistId) {
        if(songs === undefined) {songs = [];}
        if (songToStream === null) {
            songToStream = { id: "-1"};
        }
        songToStream.playlistId = playlistId;
        var playlist = songs;
        playlist.map((playlistSong) => { (playlistSong.id == songToStream.id) 
            ? playlistSong.active = true : playlistSong.active = false;
            playlistSong.playlistId = playlistId;
        });
        return playlist;
    },
    getPlaylistById(id) {
        var idx = this.loadedPlaylists.map(function(p) { return p.id; }).indexOf(id);
        if(idx < 0) {
            if(this.nowPlayingPlaylist.length === 0)
            {
                //attempt to load from sessionStorage
                this.loadPlaylistFromStorage();
            }
            return {
                id: -1,
                name: "Now Playing",
                entry: this.nowPlayingPlaylist
            }
        }
        return this.loadedPlaylists[idx];
    },
    playlistMoveNext () {
        var index = 0;
        var playlist = this.getPlaylistById(this.activePlaylist).entry;
        playlist.map((playlistSong, i) => { if(playlistSong.hasOwnProperty("active") && playlistSong.active === true) { index = i; }});
        
        playlist[index].active = false;
        if(index == (playlist.length - 1)) {
            //end of playlist
            this.songToPlay = null;
        } else {
            index++;
            playlist[index].active = true;
            this.songToPlay = playlist[index];
        }
        if (this.activePlaylist < 0 ) {
            this.nowPlayingPlaylist = playlist;
            this.savePlaylistToStorage(this.nowPlayingPlaylist);
        } else {
            //save other loaded playlists to storage??
        }
        this.emit(StreamingEvents.READY);
    },
    playlistMovePrev () {
        var index = null;
        var playlist = this.getPlaylistById(this.activePlaylist).entry;
        playlist.map((playlistSong, i) => { if(playlistSong.active === true) { index = i; }});
        playlist[index].active = false;
        if(index === 0) {
            //beginning of playlist
            this.songToPlay = null;
        } else {
            index--;
            playlist[index].active = true;
            this.songToPlay = playlist[index];
        }
        if (this.activePlaylist < 0) {
            this.nowPlayingPlaylist = playlist;
            this.savePlaylistToStorage(this.nowPlayingPlaylist);
        } else {
            //save other loaded playlists to storage??
        }
        this.emit(StreamingEvents.READY);
    },
    playlistsFetched(serverPlaylists){
        this.serverPlaylists = [];
        this.serverPlaylists = serverPlaylists.playlist;
        this.emit(ServerPlaylistEvents.ALLFETCHED);
    },
    playlistFetched(serverPlaylist){
        var idx = this.loadedPlaylists.map(function(p) { return p.id; }).indexOf(serverPlaylist.id);
        serverPlaylist.entry = this.initializePlaylist(serverPlaylist.entry, null, serverPlaylist.id);
        if(idx >= 0) {
            this.loadedPlaylists[idx] = serverPlaylist;
        } else {
            this.loadedPlaylists.push(serverPlaylist);
        }
        this.editingPlaylist = serverPlaylist.id;
        this.emit(ServerPlaylistEvents.SINGLEFETCHED);
    },
    playlistUpdated(id) {
        ApiUtil.fetchPlaylist(id);
    },
    playlistDeleted() {
        this.emit(PlaylistEvents.RELOAD);
    },
    playlistCreated(serverPlaylist) {
        this.playlistFetched(serverPlaylist);
    },
    loadPlaylistFromStorage () {
        if(this.nowPlayingPlaylist.length === 0) {
            //Check localstorage
            if(sessionStorage.currentPlaylist !== undefined) {
                this.nowPlayingPlaylist = JSON.parse(sessionStorage.currentPlaylist);
                //Check if any songs should be made ready to stream
                var index = null;
                this.nowPlayingPlaylist.map((playlistSong, i) => { if(playlistSong.active === true) { index = i; }});
                if (index !== null) { this.songToPlay = this.nowPlayingPlaylist[index]; this.emit("streaming.preload");}
            }
        }
    },
    savePlaylistToStorage(playlist) {
        sessionStorage.currentPlaylist = JSON.stringify(playlist);
    },
    removePlaylistById(id, isDelete) {
        if (id >= 0) {
            var idx = this.loadedPlaylists.map(function(p) { return p.id; }).indexOf(id);
            this.loadedPlaylists.splice(idx, 1);
            var newId = -1;
            if(idx > 0) { newId = this.loadedPlaylists[idx-1].id; }
            if(this.activePlaylist === id) { this.activePlaylist = newId; }
            if(this.editingPlaylist === id) { this.editingPlaylist = newId; }
            if(isDelete) {
                ApiUtil.deletePlaylist(id);
            }
        }
    },
    exports: {
        getSongToStream() {
            return this.songToPlay;
        },
        getPlaylist(id) {
            return this.getPlaylistById(id);
        },
        getCurrentPlaylist() {
            return this.getPlaylistById(this.activePlaylist);
        },
        fetchPlaylists() {
            ApiUtil.fetchPlaylists();
        },
        fetchPlaylist(id) {
            ApiUtil.fetchPlaylist(id);
        },
        getLoadedPlaylistsSimple() {
            return {
                active: this.activePlaylist,
                loaded: this.loadedPlaylists.map((playlist) => { return playlist.id })
            };
        },
        getServerPlaylists() {
            return this.serverPlaylists;
        },
        updatePlaylist(playlist) {
            if(this.editingPlaylist < 0) {
                this.nowPlayingPlaylist = playlist;
                this.savePlaylistToStorage(playlist);
            } else {
                var idx = this.loadedPlaylists.map(function(p) { return p.id; }).indexOf(this.editingPlaylist);
                this.loadedPlaylists[idx].entry = playlist;
            }
            this.emit(PlaylistEvents.RELOAD);
        },
        changeEditingPlaylist(index) {
            this.editingPlaylist = index;
        },
        getEditingPlaylist() {
            return this.getPlaylistById(this.editingPlaylist);
        },
        saveEditingPlaylistToServer() {
            var playlist = this.getPlaylistById(this.editingPlaylist);
            ApiUtil.updatePlaylist(playlist);
        },
        createPlaylist(playlistName) {
            ApiUtil.createPlaylist(playlistName);
        },
        removePlaylist(playlistId) {
            this.removePlaylistById(playlistId, false);
        },
        deletePlaylist(playlistId) {
            this.removePlaylistById(playlistId, true);
        }
    }
});

module.exports = PlaylistStore;