var React = require('react');
//Components
var Menu = require('./Navigation/Menu');
var { Link } = require('react-router');

var SidebarLeft = React.createClass({
    //Menu State:
    //  0: Menu
    //  1: Libary (Initial)
    getInitialState () {
        return { menuState: 1 }
    },
    handleMenuSetState( state ) {
        this.setState({
            menuState: state
        });
    },
    render () {
        return (<Menu />);
    }
});

module.exports = SidebarLeft;
