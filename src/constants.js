module.exports = {
    API: "http://myserver.subsonic.org",
    APIUser: "test", 
    APIPass: "password", 
    APIVersion: "1.12",
    APIClient: "React-Subsonic",
    ItemTypes: {
        AUDIOFILE: "audiofile"
    },
    Events: {
        StreamingEvents: {
            READY: "streaming.ready"  
        },
        PlaylistEvents: {
            LOADED: "playlist.loaded",
            RELOAD: "playlist.reaload"
        },
        SettingsEvents: {
            INVALID: "settings.invalid",
            VALID: "settings.valid",
            CHECKINGVALID: "settings.checkingvalid"
        },
        ServerPlaylistEvents: {
            ALLFETCHED: "serverplaylist.playlistsfetched",
            SINGLEFETCHED: "serverplaylist.playlistfetched"
        },
        LibraryEvents: {
            SEARCHRETURNED: "library.searchreturned"
        }
    }
}