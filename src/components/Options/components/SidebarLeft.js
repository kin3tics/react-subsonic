var React = require('react');
var UserStore = require('../../../stores/UserStore');
//Components
var Menu = require('../../Navigation/Menu');
var { Link } = require('react-router');

var SidebarLeft = React.createClass({
    getInitialState () {
        return { 
            colorScheme: UserStore.getColorScheme(),
            menuState: true 
        }
    },
    setMenuState( state ) {
        this.setState({
            menuState: state
        });
    },
    render () {
        var colorScheme = this.state.colorScheme;
        var menuSidebarStyle = {
            background: colorScheme.MenuSidebar.BackgroundColor
        };
        if(!this.state.menuState) {
            return (<Menu linkClick={this.setMenuState} />);
        }
        var menuIcon = (<span className="icon icon-menu clickable" onClick={this.setMenuState.bind(this,false)}></span>);
        return (
          <div style={menuSidebarStyle} className="nav-container">
            <div className="menu-bar">
                {menuIcon}<h5> Options </h5>
            </div>
            <div className="menu-list-container scrollable">
                <div>
                    <Link to="Options/ServerSettings" onClick={ this.handleClick }><span className="icon icon-album" ></span><h5> Server Settings </h5></Link>
                </div>
                <div>
                    <Link to="Options/ColorScheme" onClick={ this.handleClick }><span className="icon icon-album" ></span><h5> Color Scheme </h5></Link>
                </div>
            </div>
          </div>
        );
    }
});

module.exports = SidebarLeft;
