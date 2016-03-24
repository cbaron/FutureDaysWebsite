require('browserify-fs').readdir( './views', ( err, files ) => {
    if( err ) throw new Error( err )
    files.forEach( file => require(file) )
} )

require('./router')

require('jquery')( () => {
    //require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
