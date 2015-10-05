var React = require('react');
//Components
var Menu = require('../../Navigation/Menu');
var { Link } = require('react-router');

var SidebarLeft = React.createClass({
    getInitialState () {
        return { menuState: true }
    },
    setMenuState( state ) {
        this.setState({
            menuState: state
        });
    },
    render () {
        if(!this.state.menuState) {
            return (<Menu linkClick={this.setMenuState} />);
        }
        var menuIcon = (<span className="icon icon-menu clickable" onClick={this.setMenuState.bind(this,false)}></span>);
        return (
          <div className="nav-container">
            <div className="menu-bar">
                {menuIcon}<h5> Options </h5>
            </div>
          </div>
        );
    }
});

module.exports = SidebarLeft;
