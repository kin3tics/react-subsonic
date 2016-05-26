var React = require('react');
var actions = require('../actions/UserActions');
//Stores
var UserStore = require('../stores/UserStore');

var Login = React.createClass({
    getInitialState () {
        return { 
            settings: null,
            loading: false
        };
    },
    componentWillMount() {
        this.getSettingsFromProps();
    },
    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.getSettingsFromProps();
        }
        if (!this.props.loggingIn && this.state.loading) {
            this.setState({
                loading: false
            });
        }
    },
    getSettingsFromProps() {
        if (this.props.settings === null) {
            this.updateSettings({ API: "http://myserver.subsonic.org", APIUser: null, APIPass: null });
        } else {
            this.updateSettings(this.props.settings);
        }
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
    handleLogin(e) {
        var settings = this.state.settings;
        if(settings.API.length > 0 
            && settings.APIUser !== null && settings.APIUser.length > 0 
            && settings.APIPass !== null && settings.APIPass.length > 0) {
            actions.saveSettings(settings.API, settings.APIUser, settings.APIPass);
            settings.error = null;
            this.setState({
                settings: settings,
                loading: true
            });
        } else {
            settings.error = "Please provide a username and password.";
            this.updateSettings(settings);
        }
    },
    render () {
        var settings = this.state.settings;
        var error = "";
        if (settings.hasOwnProperty("error") && settings.error !== null) {
            error = (<span><strong>Error: </strong>{settings.error}</span>);
        }
        
        var buttonClass="waves-effect waves-light btn";
        var spinner = "";
        if(this.state.loading) {
            buttonClass += " disabled";
            spinner = (
                <div className="preloader-wrapper small active">
                    <div className="spinner-layer spinner-blue-only">
                      <div className="circle-clipper left">
                        <div className="circle"></div>
                      </div><div className="gap-patch">
                        <div className="circle"></div>
                      </div><div className="circle-clipper right">
                        <div className="circle"></div>
                      </div>
                    </div>
                  </div>);
        }
        
        return (
        <form action="#">
          <div className="login-panel">
            <div>
                <label htmlFor="server_url">Server URL</label>
                <div className="input-wrapper">
                    <input defaultValue={settings.API} id="server_url" type="text" onChange={this.onUrlChange} />
                </div>
            </div>
            <div>
                <label htmlFor="user_name">Username</label>
                <div className="input-wrapper">
                    <input defaultValue={settings.APIUser} id="user_name" type="text" onChange={this.onUserChange} />
                </div>
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                    <input defaultValue={settings.APIPass} id="password" type="password" onChange={this.onPasswordChange} />
                </div>
            </div>
            <div style={{textAlign:'right'}}>
                <button onClick={this.handleLogin}>Login</button>
            </div>
          </div>
        </form>
        );
    }
});

module.exports = Login;