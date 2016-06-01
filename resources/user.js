module.exports = Object.assign( { }, require('./__proto__'), {

    GET() { return this.validate.GET.call(this).then( () => this.respond( { body: this.user } ) ) },

    PATCH() {
        return this.slurpBody()
        .then( () => {
            Object.keys( this.body ).forEach( key => this.user[ key ] = this.body[ key ] )
            return this.Q( this.User.createToken.call(this) )
        } )
        .then( token => this.User.respondSetCookie.call( this, token, { } ) )
    },

    User: require('./util/User'),

    validate: Object.assign( {}, Base.prototype.validate, {
        PATCH: Base.prototype.validate.GET
    } )

} )

module.exports = User
