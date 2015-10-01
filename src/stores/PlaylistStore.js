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
        actions.playlistUpdated
    ],
    playSong (song, playlistIndex) {
        if(playlistIndex !== undefined && playlistIndex >= 0) {
            this.activePlaylist = playlistIndex;
        } else {
            this.activePlaylist = -1;
        }
        var playlist = this.getActivePlaylist();
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
    initializePlaylist(songs, songToStream, playlistIndex) {
        if(songs === undefined) {songs = [];}
        if (songToStream === null) {
            songToStream = { id: "-1"};
        }
        songToStream.playlistIndex = playlistIndex;
        var playlist = songs;
        playlist.map((playlistSong) => { (playlistSong.id == songToStream.id) 
            ? playlistSong.active = true : playlistSong.active = false;
            playlistSong.playlistIndex = playlistIndex;
        });
        return playlist;
    },
    getActivePlaylist() {
        if (this.activePlaylist < 0 || this.activePlaylist >= this.loadedPlaylists.length) {
            return this.nowPlayingPlaylist;
        } else {
            return this.loadedPlaylists[this.activePlaylist].entry;
        }
    },
    getPlaylistByIndex(index) {
        if(index < 0 || index >= this.loadedPlaylists.length) {
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
        
        return this.loadedPlaylists[index];
    },
    playlistMoveNext () {
        var index = 0;
        var playlist = this.getActivePlaylist();
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
        if (this.activePlaylist < 0 || this.activePlaylist >= this.loadedPlaylists.length) {
            this.nowPlayingPlaylist = playlist;
            this.savePlaylistToStorage(this.nowPlayingPlaylist);
        } else {
            //save other loaded playlists to storage??
        }
        this.emit(StreamingEvents.READY);
    },
    playlistMovePrev () {
        var index = null;
        var playlist = this.getActivePlaylist();
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
        if (this.activePlaylist < 0 || this.activePlaylist >= this.loadedPlaylists.length) {
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
        if(idx >= 0) {
            serverPlaylist.entry = this.initializePlaylist(serverPlaylist.entry, null, idx);
            this.loadedPlaylists[idx] = serverPlaylist;
        } else {
            serverPlaylist.entry = this.initializePlaylist(serverPlaylist.entry, null, this.loadedPlaylists.length);
            this.loadedPlaylists.push(serverPlaylist);
        }
        this.emit(ServerPlaylistEvents.SINGLEFETCHED);
    },
    playlistUpdated(id) {
        ApiUtil.fetchPlaylist(id);
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
    exports: {
        getSongToStream() {
            return this.songToPlay;
        },
        getPlaylist(index) {
            return this.getPlaylistByIndex(index);
        },
        getCurrentPlaylist() {
            return this.getPlaylistByIndex(this.activePlaylist);
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
                numLoaded: this.loadedPlaylists.length
            };
        },
        getServerPlaylists() {
            return this.serverPlaylists;
        },
        updatePlaylist(playlist) {
            if(this.editingPlaylist < 0 || this.editingPlaylist >= this.loadedPlaylists.length) {
                this.nowPlayingPlaylist = playlist;
                this.savePlaylistToStorage(playlist);
            } else {
                this.loadedPlaylists[this.editingPlaylist].entry = playlist;
            }
            this.emit(PlaylistEvents.RELOAD);
        },
        changeEditingPlaylist(index) {
            this.editingPlaylist = index;
        },
        getEditingPlaylist() {
            return this.getPlaylistByIndex(this.editingPlaylist);
        },
        saveEditingPlaylistToServer() {
            var playlist = this.getPlaylistByIndex(this.editingPlaylist);
            ApiUtil.updatePlaylist(playlist);
        },
        createPlaylist(playlistName) {
            ApiUtil.createPlaylist(playlistName);
        }
    }
});

module.exports = PlaylistStore;