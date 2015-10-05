//TODO: I Don't like this organization style.
var albumDetails = {
    path: ':albumId',
    getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Album'))
    })
  }
}

var artistDetails = {
  path: ':artistId',

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/ArtistAlbums'))
    })
  },
  
  childRoutes: [albumDetails]
}

module.exports = {
    path: 'artists',
    components: { content: require('./components/ArtistAlbums'), sidebarLeft: require('./components/SidebarLeft') },
    childRoutes: [artistDetails]
}