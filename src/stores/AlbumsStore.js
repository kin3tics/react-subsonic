var flux = require('flux-react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: {LibraryEvents } } = require('../constants');

var AlbumsStore = flux.createStore({
    artistAlbumCache: {},
    albumCache:{},
    searchResults: null,
    actions: [
        actions.loadAlbums,
        actions.loadedAlbums,
        actions.loadAlbum,
        actions.loadedAlbum,
        actions.searchedLibrary
    ],
    loadAlbums (artistId, forceUpdate = false) {
        if(this.artistAlbumCache.hasOwnProperty(artistId) && !forceUpdate)
        {
            this.emit('albums.cacheHasData');
        } else {
            ApiUtil.loadArtistAlbums(artistId);
        }
    },
    loadedAlbums (artistId, albums) {
        this.artistAlbumCache[artistId] = [];
        albums.map((album) => {
            if( this.albumCache[album.id] === undefined) { this.albumCache[album.id] = {}; }
            this.albumCache[album.id] = Object.assign(this.albumCache[album.id], album);
            this.artistAlbumCache[artistId].push(this.albumCache[album.id]);
        });
        this.emit('albums.cacheUpdated');
    },
    loadAlbum(id, forceUpdate = false) {
        if(this.albumCache[id] !== undefined && this.albumCache[id].hasOwnProperty("detailsLoaded") && !forceUpdate)
            this.emit('albumDetails.cacheHasData');
        else
            ApiUtil.loadAlbum(id);
    },
    loadedAlbum(album) {
        if( this.albumCache[album.id] === undefined) { this.albumCache[album.id] = {}; }
        this.albumCache[album.id] = Object.assign(this.albumCache[album.id], album);
        this.albumCache[album.id]["detailsLoaded"] = true;
        this.emit('albumDetails.cacheUpdated');
    },
    searchedLibrary(searchResults) {
        this.searchResults = searchResults;
        this.emit(LibraryEvents.SEARCHRETURNED);
    },
    exports: {
        getAlbums(artistId) {
            if(this.artistAlbumCache.hasOwnProperty(artistId))
                return this.artistAlbumCache[artistId];
            return [];
        },
        getAlbumDetails(id) {
            if(this.albumCache.hasOwnProperty(id) && this.albumCache[id].hasOwnProperty("detailsLoaded")) {
                return this.albumCache[id];
            }
            return null;
        },
        searchLibrary(criteria) {
            this.searchResults = null;
            ApiUtil.searchLibrary(criteria);
        },
        getSearchResults() {
            return this.searchResults;
        }
    }
});

module.exports = AlbumsStore;