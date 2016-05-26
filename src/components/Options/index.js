var colorScheme = {
    path: 'ColorScheme',
    getComponent (location, cb) {
    require.ensure([], function(require) {
      cb(null, { content: require('./components/ColorScheme') })
    })
  }
}

module.exports = {
    path: 'options',
    getComponents(nextState, cb) {
    	require.ensure([], function(require) {
    		cb(null, {
    			content: require('./components/Options'), 
    			sidebarLeft: require('./components/SidebarLeft')
    		})
    	})
    },
    childRoutes: [colorScheme]
}