require('jquery')( () => {
    require('./router')
    require('backbone').history.start( { pushState: true } )
} )
