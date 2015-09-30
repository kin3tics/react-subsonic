var flux = require('flux-react');

var UserActions = flux.createActions([
    //SettingsActions
    'loadSettings',
    'saveSettings',
    'pingReturn'
]);

module.exports = UserActions;
