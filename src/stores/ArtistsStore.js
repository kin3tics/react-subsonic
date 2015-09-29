var flux = require('flux-react');
var actions = require('../actions/AlbumActions');
var ApiUtil = require('../utils/ApiUtil');

var ArtistsStore = flux.createStore({
    artists: {},
    actions: [
        actions.loadArtists,
        actions.loadedArtists
    ],
    loadArtists () {
        if(this.artists.index === undefined) {
            //Check localstorage, then go to api (saves time)
            if(sessionStorage.artistsCache !== undefined) {
                this.loadedArtists(JSON.parse(sessionStorage.artistsCache));
            } else {
                ApiUtil.loadArtists();
            }
        }
        else {
            this.emit('artists.preloaded');
        }
    },
    loadedArtists (artists) {
        this.artists = artists;
        sessionStorage.artistsCache = JSON.stringify(artists);
        this.emit('artists.change');
    },
    exports: {
        getArtists() {
            return this.artists;
        },
        getArtist(id) {
            
        }
    }
});

module.exports = ArtistsStore;