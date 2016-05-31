require('./router')

require('jquery')( () => require('backbone').history.start( { pushState: true } ) )
