var React = require('react');
var actions = require('../../../actions/UserActions');
//Stores
var UserStore = require('../../../stores/UserStore');

var ColorScheme = require('./ColorScheme');

var Options = React.createClass({
    //transitionHook: null,
    getInitialState () {
        return { 
            settings: UserStore.getSettings(),
            isDirty: false
        };
    },
    // Challenge Navigation if form is edited but not saved (Need to finalize at some point)
    /*componentWillMount() {
        var that = this;
        this.transitionHook = this.props.history.listenBefore((isUnload, cb) => {
            if(that.state.isDirty)
                cb("you sure you want to leave?");
            return cb(true);
        });
    },
    componentWillUnmount() {
        this.transitionHook();
    },*/
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
            settings: settings,
            isDirty: true
        });
    },
    saveSettings() {
        var settings = this.state.settings;
        actions.saveSettings(settings.API, settings.APIUser, settings.APIPass);
    },
    render() {
        var settings = this.state.settings;
        var { content } = this.props;
        return (
            <div className="settings-container">
                { content ? content : (
                <div>
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
                ) }
            </div>
            
        );
    } 
});

module.exports = Options