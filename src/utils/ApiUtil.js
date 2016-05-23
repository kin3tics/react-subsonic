var xhr = require('../lib/xhr');
var { APIVersion, APIClient } = require('../constants');
var actions = require('../actions/AlbumActions');
var userActions = require('../actions/UserActions');
//Stores

var ApiUtils = {
    getAPIParams() {
        var settings = null;
        if(localStorage.serverSettings !== undefined) {
            settings = JSON.parse(localStorage.serverSettings);
        }
        if(settings === null) {
            return { url: "", requiredParams: "" };
        }
        return {
            url: settings.API,
            requiredParams: `u=${settings.APIUser}&p=${settings.APIPass}&f=json&v=${APIVersion}&c=${APIClient}`
        };
    },
    loadAlbums() {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getAlbumList2?${params.requiredParams}&type=random`, (err, res) => {
          actions.loadedAlbums(res['subsonic-response'].albumList2.album);
        });
    },
    loadArtistAlbums(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getArtist?${params.requiredParams}&id=${id}`, (err, res) => {
          actions.loadedAlbums(id, res['subsonic-response'].artist.album);
        });
    },
    loadAlbum(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getAlbum?${params.requiredParams}&id=${id}`, (err, res) => {
          actions.loadedAlbum(res['subsonic-response'].album);
        });
    },
    getAlbumArtUrl(id) {
        var params = this.getAPIParams();
        return `${params.url}/rest/getCoverArt?${params.requiredParams}&id=${id}`;
    },
    loadArtists() {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getArtists?${params.requiredParams}`, (err, res) => {
          actions.loadedArtists(res['subsonic-response'].artists);
        });
    },
    loadArtistDetails(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getArtistInfo2?${params.requiredParams}&id=${id}`, (err, res) => {
          actions.loadedArtistDetails(res['subsonic-response'].artistInfo2);
        });
    },
    fetchPlaylists() {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getPlaylists?${params.requiredParams}`, (err, res) => {
          actions.playlistsFetched(res['subsonic-response'].playlists);
        });
    },
    fetchPlaylist(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/getPlaylist?${params.requiredParams}&id=${id}`, (err, res) => {
          actions.playlistFetched(res['subsonic-response'].playlist);
        });
    },
    createPlaylist(playlistName) {
        //Create playlist, then go get the list and return the "new" one if successful
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/createPlaylist?${params.requiredParams}&name=${playlistName}`, (err, res) => {
          xhr.getJSON(`${params.url}/rest/getPlaylists?${params.requiredParams}`, (err, res) => {
                var retPlaylists = res['subsonic-response'].playlists.playlist;
                if(retPlaylists.length > 0){
                    var newPlaylist = retPlaylists[retPlaylists.length - 1];
                    if(newPlaylist.name == playlistName) {
                        actions.playlistCreated(newPlaylist);
                    }
                }
            });
        });
    },
    updatePlaylist(playlist) {
        var params = this.getAPIParams();
        //TODO: Finish Me
        var removals = [...Array(playlist.songCount)].map((x,i) => {return "&songIndexToRemove=" + i});
        var adds = playlist.entry.map((song) => {return "&songIdToAdd=" + song.id; });
        xhr.getJSON(`${params.url}/rest/updatePlaylist?${params.requiredParams}&playlistId=${playlist.id}${adds.join("")}${removals.join("")}`, (err, res) => {
          actions.playlistUpdated(playlist.id);
        });
    },
    deletePlaylist(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/deletePlaylist?${params.requiredParams}&id=${id}`, (err, res) => {
          actions.playlistDeleted(id);
        });
    },
    getStreamingUrl(id) {
        var params = this.getAPIParams();
        return `${params.url}/rest/stream?${params.requiredParams}&id=${id}&maxBitRate=320&estimateContentLength=true`;
    },
    searchLibrary(query) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/search3?${params.requiredParams}&query=${query}&songCount=50`, (err, res) => {
          actions.searchedLibrary(res['subsonic-response'].searchResult3);
        });
    },
    scrobbleSong(id) {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/scrobble?${params.requiredParams}&id=${id}`, () => {
            //no action needed
        });
    },
    pingServer() {
        var params = this.getAPIParams();
        xhr.getJSON(`${params.url}/rest/ping?${params.requiredParams}`, (err, res) => {
          if(err) {
            userActions.pingReturn({
                "status" : "failed",
                "version" : null,
                "error" : {
                    "code" : 404,
                    "message" : "The server could not be found."
                }});
          } else {
            userActions.pingReturn(res['subsonic-response']);
          }
        });
    }
};

module.exports = ApiUtils;