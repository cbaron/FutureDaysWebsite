var MyView = require('./MyView'),
    Home = function() { return MyView.apply( this, arguments ) }

Object.assign( Home.prototype, MyView.prototype, {

	template: require('../templates/home')

} )

module.exports = Home