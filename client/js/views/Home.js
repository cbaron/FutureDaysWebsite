var MyView = require('./MyView'),
    Home = function() { return MyView.apply( this, arguments ) }

Object.assign( Home.prototype, MyView.prototype, {

	postRender() { return },

    requiresLogin: false,

    template: require('./templates/home')

} )

module.exports = Home
