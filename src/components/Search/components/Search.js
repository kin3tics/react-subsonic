var React = require('react');
var { Events: {LibraryEvents } } = require('../../../constants');
//Stores
var AlbumsStore = require('../../../stores/AlbumsStore');
//Components
var SearchResults = require('./SearchResults');

var Search = React.createClass({
    mixins: [ React.History ],
    getInitialState () {
        var criteria = "";
        if(this.props.params.searchCriteria) { criteria = this.props.params.searchCriteria; }
        return {
            searchCriteria: criteria
        };
    },
    componentDidMount() {
        if(this.state.searchCriteria.length > 0)
            AlbumsStore.searchLibrary(this.state.searchCriteria);   
    },
    setSearchCriteria(criteria) {
        this.setState({
            searchCriteria: criteria
        });
    },
    updateSearchCriteria(e) {
        this.setSearchCriteria(e.target.value);  
    },
    handleSearch() {
        this.props.history.pushState(null, `/search/${this.state.searchCriteria}`, null);
        AlbumsStore.searchLibrary(this.state.searchCriteria);
    },
    handleKeyPress(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == '13'){
          this.handleSearch();
          e.preventDefault();
        }
    },
    render() {
        return (
            <div>
                <div className="search-wrapper card">
                    <input value={this.state.searchCriteria} onChange={this.updateSearchCriteria} className="search-box" onKeyPress={this.handleKeyPress} />
                    <span className="icon icon-search-2 clickable" onClick={this.handleSearch}></span>
                </div>
                <SearchResults />
            </div>
        );
    } 
});

module.exports = Search