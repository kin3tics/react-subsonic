//TODO: I Don't like this organization style.
var searchCriteria = {
    path: ':searchCriteria',
    getComponent (location, cb) {
    require.ensure([], function(require) {
      cb(null, require('./components/SearchResults'))
    })
  }
}

module.exports = {
  path: 'search',
  components: { content: require('./components/Search'), sidebarLeft: require('./components/SidebarLeft') },

  /*getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Search'))
    })
  },*/
  
  childRoutes: [searchCriteria]
}