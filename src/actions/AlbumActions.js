var flux = require('flux-react');

var AlbumActions = flux.createActions([
    //LoadingActions
    'loadAlbums',
    'loadedAlbums',
    'loadAlbum',
    'loadedAlbum',
    'loadArtists',
    'loadedArtists',
    //Player/Playlist Actions
    'playSong',
    'createTempPlaylist',
    'playlistMoveNext',
    'playlistMovePrev',
    'playlistCreated',
    'deletedPlaylist',
    'playlistUpdated',
    'playlistsFetched',
    'playlistFetched'
]);

module.exports = AlbumActions;
