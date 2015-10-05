var React = require('react');
var actions = require('../../../actions/UserActions');
//Stores
var UserStore = require('../../../stores/UserStore');

var Options = React.createClass({
    getInitialState () {
        return { 
            settings: UserStore.getSettings()
        };
    },
    onUrlChange (e) {
        var settings = this.state.settings;
        settings.API = e.target.value;
        this.updateSettings(settings);
    },
    onUserChange (e) {
        var settings = this.state.settings;
        settings.APIUser = e.target.value;
        this.updateSettings(settings);
    },
    onPasswordChange (e) {
        var settings = this.state.settings;
        settings.APIPass = e.target.value;
        this.updateSettings(settings);
    },
    updateSettings(settings) {
        this.setState({
            settings: settings
        });
    },
    saveSettings() {
        var settings = this.state.settings;
        actions.saveSettings(settings.API, settings.APIUser, settings.APIPass);
    },
    render() {
        var settings = this.state.settings;
        return (
            <div className="settings-container">
                <h5>Server Settings</h5>
                <div className="server-settings-container"><div className="input-field">
                    <input defaultValue={settings.API} id="server_url" type="text" onChange={this.onUrlChange} />
                    <label className="active" htmlFor="server_url">Server URL</label>
                </div>
                <div className="input-field">
                    <input defaultValue={settings.APIUser} id="user_name" type="text" onChange={this.onUserChange} />
                    <label className="active" htmlFor="user_name">Username</label>
                </div>
                <div className="input-field">
                    <input defaultValue={settings.APIPass} id="password" type="password" onChange={this.onPasswordChange} />
                    <label className="active" htmlFor="passwords">Password</label>
                </div>
                <a className="waves-effect waves-light btn" onClick={this.saveSettings}>Update</a>
                </div>
            </div>
        );
    } 
});

module.exports = Options