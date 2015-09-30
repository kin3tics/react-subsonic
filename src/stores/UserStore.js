var flux = require('flux-react');
var actions = require('../actions/UserActions');
var ApiUtil = require('../utils/ApiUtil');
var { Events: {SettingsEvents}, APIVersion, APIClient } = require('../constants');

var UserStore = flux.createStore({
    settings: null,
    actions: [
        actions.loadSettings,
        actions.saveSettings,
        actions.pingReturn
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
    exports: {
        getSettings() {
            if (this.settings === null)
                this.loadSettings();
            return this.settings;
        }
    }
});

module.exports = UserStore;