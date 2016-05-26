var List = require('../util/List'),
    ListDemo = function() { return List.apply( this, arguments ) }

Object.assign( ListDemo.prototype, List.prototype, {

	postRender() { return },

    requiresLogin: false,

    template: require('../templates/demo/listDemo')

} )

module.exports = ListDemo