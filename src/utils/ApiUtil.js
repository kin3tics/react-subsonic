var xhr = require('../lib/xhr');
var { API, APIUser, APIPass, APIVersion, APIClient } = require('../constants');
var actions = require('../actions/AlbumActions');

var requiredParams = `u=${APIUser}&p=${APIPass}&f=json&v=${APIVersion}&c=${APIClient}`;

var ApiUtils = {
  loadAlbums() {
      xhr.getJSON(`${API}/rest/getAlbumList2?${requiredParams}&type=random`, (err, res) => {
          actions.loadedAlbums(res['subsonic-response'].albumList2.album);
      });
  },
  loadArtistAlbums(id) {
      xhr.getJSON(`${API}/rest/getArtist?${requiredParams}&id=${id}`, (err, res) => {
          actions.loadedAlbums(id, res['subsonic-response'].artist.album);
      });
  },
  loadAlbum(id) {
      xhr.getJSON(`${API}/rest/getAlbum?${requiredParams}&id=${id}`, (err, res) => {
          actions.loadedAlbum(res['subsonic-response'].album);
      });
  },
  getAlbumArtUrl(id) {
      return `${API}/rest/getCoverArt?${requiredParams}&id=${id}`;
  },
  loadArtists() {
      xhr.getJSON(`${API}/rest/getArtists?${requiredParams}`, (err, res) => {
          actions.loadedArtists(res['subsonic-response'].artists);
      });
  },
  loadArtistDetails(id) {
      xhr.getJSON(`${API}/rest/getArtistInfo2?${requiredParams}&id=${id}`, (err, res) => {
          actions.loadedArtistDetails(res['subsonic-response'].artistInfo2);
      });
  },
  getStreamingUrl(id) {
      return `${API}/rest/stream?${requiredParams}&id=${id}`;
  },
};

module.exports = ApiUtils;