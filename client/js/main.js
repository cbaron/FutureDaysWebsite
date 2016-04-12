console.log('heyo')
require('browserify-fs').readdir( './views', ( err, files ) => {
    if( err ) throw new Error( err )
    files.forEach( file => require(file) )
} )

require('browserify-fs').readdir( './templates', ( err, files ) => {
    if( err ) throw new Error( err )
    files.forEach( file => require(file) )
} )
console.log('heyo')
require('./router')

require('jquery')( () => {
    //require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
