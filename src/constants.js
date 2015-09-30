module.exports = {
    API: "http://kin3tical.subsonic.org",
    APIUser: "kin3tics", 
    APIPass: "k2210357", 
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
        }
    }
}