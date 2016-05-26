var MyView = require('../MyView'),
    FormDemo = function() { return MyView.apply( this, arguments ) }

Object.assign( FormDemo.prototype, MyView.prototype, {

	postRender() { return },

    requiresLogin: false,

    template: require('../templates/demo/formDemo')

} )

module.exports = FormDemo