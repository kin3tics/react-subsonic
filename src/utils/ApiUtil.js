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
    getStreamingUrl(id) {
        var params = this.getAPIParams();
        return `${params.url}/rest/stream?${params.requiredParams}&id=${id}`;
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