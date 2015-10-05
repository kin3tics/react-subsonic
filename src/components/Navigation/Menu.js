var React = require('react');
//Components
var { Link } = require('react-router');

var Menu = React.createClass({
    handleClick() {
        if (this.props.linkClick !== undefined)
            this.props.linkClick(true);
    },
    render () {
        return (
            <div className="nav-container">
                <div className="menu-bar">
                    <span className="icon icon-menu clickable" onClick={ this.handleClick }></span><h5> Menu </h5>
                </div>
                <div className="menu-list-container scrollable">
                    <div>
                        <Link to="/artists" onClick={ this.handleClick }><span className="icon icon-album" ></span><h5> Library </h5></Link>
                    </div>
                    <div>
                        <Link to="/search" onClick={ this.handleClick }><span className="icon icon-search" ></span><h5> Search </h5></Link>
                    </div>
                    <div>
                        <Link to="/options" onClick={ this.handleClick }><span className="icon icon-options"></span><h5> Options </h5></Link>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Menu;
