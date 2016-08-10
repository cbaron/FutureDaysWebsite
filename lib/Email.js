module.exports = Object.create( Object.assign( {}, require('./MyObject'), {
    
    Email: require('email').Email,

    send( data ) {
        var email = new this.Email( data )
        return this.P( email.send, [ ], email )
    }

} ) )
