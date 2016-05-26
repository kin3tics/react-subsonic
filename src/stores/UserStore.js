var flux = require('flux-react');
var actions = require('../actions/UserActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: {SettingsEvents}, APIVersion, APIClient, DefaultColorScheme } = require('../constants');

var UserStore = flux.createStore({
    settings: null,
    colorScheme: null,
    actions: [
        actions.loadSettings,
        actions.saveSettings,
        actions.pingReturn,
        actions.loadColorScheme,
        actions.saveColorScheme
    ],
    loadSettings() {
        //Check storage, then validate against pingServer
        this.settings = this.loadServerSettingsFromStorage();
        if(this.settings !== null
            && this.settings.API !== null
            && this.settings.APIUser !== null
            && this.settings.APIUser !== null
        ) {
            ApiUtil.pingServer();
            this.emit(SettingsEvents.CHECKINGVALID);
        }
    },
    saveSettings(url, user, pass) {
        if(url === null || user === null || pass === null) { return; }
        
        this.settings = {
            API: url,
            APIUser: user,
            APIPass: pass,
            valid: false
        };
        this.saveServerSettingsToStorage(this.settings);
        ApiUtil.pingServer();
        this.emit(SettingsEvents.CHECKINGVALID);
    },
    pingReturn(returnObj) {
        if(returnObj.status === "ok") {
            this.settings.valid = true;
            this.emit(SettingsEvents.VALID);
        } else {
            this.settings.valid = false;
            this.settings.error = returnObj.error.message;
            this.emit(SettingsEvents.INVALID)
        }
    },
    loadColorScheme() {
        this.colorScheme = this.loadColorSchemeFromStorage();
    },
    saveColorScheme(colorScheme) {
        this.colorScheme = colorScheme;
        this.saveColorSchemeToStorage(colorScheme);
    },
    loadServerSettingsFromStorage () {
        //Check localstorage
        if(localStorage.serverSettings !== undefined) {
            return JSON.parse(localStorage.serverSettings);
        }
        return null;
    },
    saveServerSettingsToStorage(settings) {
        localStorage.serverSettings = JSON.stringify(settings);
    },
    loadColorSchemeFromStorage() {
        if(localStorage.colorScheme !== undefined) {
            return JSON.parse(localStorage.colorScheme);
        }
        return DefaultColorScheme;
    },
    saveColorSchemeToStorage(scheme) {
        localStorage.colorScheme = JSON.stringify(scheme);
    },
    resetColorSchemeInStorage() {
        localStorage.removeItem('colorScheme');
        return this.loadColorSchemeFromStorage();
    },
    exports: {
        getSettings() {
            if (this.settings === null)
                this.loadSettings();
            return this.settings;
        },
        getColorScheme() {
            if (this.colorScheme === null)
                this.loadColorScheme();
            return this.colorScheme;
        },
        resetDefaultColorScheme() {
            this.resetColorSchemeInStorage();
        }
    }
});

module.exports = UserStore;