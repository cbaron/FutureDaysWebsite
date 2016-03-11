require('./router')

require('jquery')( () => {
    require('./views/modal')
    require('backbone').history.start( { pushState: true } )
} )
