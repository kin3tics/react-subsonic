var React = require('react');
var actions = require('../actions/AlbumActions');
//Stores
var UserStore = require('../stores/UserStore');
//Components
var SidebarLeft = require("./SidebarLeft");
var SidebarRight = require("./SidebarRight");
var Login = require("./Login");

var { Events: {SettingsEvents} } = require('../constants');


var App = React.createClass({
    getInitialState () {
        return { settings: UserStore.getSettings(),
                 loggingIn: false
               }
    },
    componentWillMount () {
        UserStore.on(SettingsEvents.CHECKINGVALID, this.pendingState);
        UserStore.on(SettingsEvents.VALID, this.updateState);
        UserStore.on(SettingsEvents.INVALID, this.updateState);
    },
    componentWillUnmount () {
        UserStore.off(SettingsEvents.CHECKINGVALID, this.pendingState);
        UserStore.off(SettingsEvents.VALID, this.updateState);
        UserStore.off(SettingsEvents.INVALID, this.updateState);
    },
    updateState () {
        this.setState({
            settings: UserStore.getSettings(),
            loggingIn: false
        });  
    },
    pendingState() {
        this.setState({
            loggingIn: true
        });
    },
    render () {
        var settings = this.state.settings;
        if (settings === null || !settings.valid || this.state.loggingIn) {
            return (
                <Login settings={settings} loggingIn={this.state.loggingIn} />
            );
        }
        
        return (
          <div>
          <SidebarLeft />
          <main>
                { this.props.children ? this.props.children : (<div className="row album-list"></div>) }
          </main>
          <SidebarRight />
          </div>
        );
    }
});

module.exports = App;
