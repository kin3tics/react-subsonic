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
    'playlistShuffle',
    'playlistCreated',
    'playlistDeleted',
    'playlistUpdated',
    'playlistsFetched',
    'playlistFetched',
    //Search Actions
    'searchedLibrary'
]);

module.exports = AlbumActions;
