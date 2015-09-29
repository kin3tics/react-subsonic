//TODO: I Don't like this organization style.
var albumDetails = {
    path: ':albumId',
    getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/Album'))
    })
  }
}

module.exports = {
  path: 'artists/:artistId',

  getComponent (location, cb) {
    require.ensure([], (require) => {
      cb(null, require('./components/ArtistAlbums'))
    })
  },
  
  childRoutes: [albumDetails]
}