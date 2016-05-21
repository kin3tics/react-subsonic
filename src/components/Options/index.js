module.exports = {
    path: 'options',
    getComponents(nextState, cb) {
    	require.ensure([], function(require) {
    		cb(null, {
    			content: require('./components/Options'), 
    			sidebar: require('./components/SidebarLeft')
    		})
    	})
    }
}