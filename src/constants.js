module.exports = {
    API: "http://myserver.subsonic.org",
    APIUser: "User", 
    APIPass: "Password", 
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
        }
    }
}