module.exports = Object.assign( { }, require('./__proto__'), {
    
    bcrypt: require('bcrypt'),

    DELETE: [ function() { return this.notFound() } ],

    GET: [
        function() {
            if( this.path.length !== 2 ) return this.notFound()

            return this.Validate.parseSignature( this, this.path[1] )
            .then( () => this.Postgres.query( "SELECT id, email FROM person where id = $1 and email = $2", [ this.user.id, this.user.email ] ) )
            .then( result => result.rows.length === 1 ? Promise.resolve() : this.notFound( true ) )
            .then( () => this.Postgres.query( `UPDATE person SET "hasEmailValidated" = true WHERE id = ${this.user.id}` ) )
            .then( () => this.respond( { body: { success: true } } ) )
        }
    ],

    PATCH: [ function() { return this.notFound() }, ],

    POST: [ function() { return this.notFound() } ]

} )
