var React = require('react');
var actions = require('../../../actions/UserActions');
//Stores
var UserStore = require('../../../stores/UserStore');

var ColorPickerSwatch = require('./ColorPickerSwatch');
/*
DefaultColorScheme: {
        MenuSidebar: {
            BackgroundColor: '202020',
            FontColor: 'DDDDDD',
            MenuItem: {
                BackgroundColor: null,
                FontColor: null,
                HoverBackgroundColor: 'DDDDDD',
                HoverFontColor: '444444'
            }
        }
    }
*/

var ColorScheme = React.createClass({
    //transitionHook: null,
    getInitialState () {
        return { 
            colorScheme: UserStore.getColorScheme(),
            isDirty: false
        };
    },
    onMenuSidebarBackgroundColorChange (color) {
        var colorScheme = this.state.colorScheme;
        this.state.colorScheme.MenuSidebar.BackgroundColor = color.hex;
        this.saveColorScheme();
    },
    saveColorScheme() {
        var colorScheme = this.state.colorScheme;
        actions.saveColorScheme(colorScheme);
    },
    resetColorScheme() {
        UserStore.resetDefaultColorScheme();
    },
    render() {
        var colorScheme = this.state.colorScheme;
        return (
            <div className="settings-container">
                <h5>Color Scheme</h5>

                <div className="server-settings-container">
                    <h6>MenuSidebar</h6>
                    <div className="input-field">
                        <label className="active">Background Color</label>
                        <ColorPickerSwatch onUpdate={this.onMenuSidebarBackgroundColorChange} color={colorScheme.MenuSidebar.BackgroundColor} />
                    </div>
                </div>
                <button onClick={this.resetColorScheme}>Reset</button>
            </div>
        );
    } 
});

module.exports = ColorScheme