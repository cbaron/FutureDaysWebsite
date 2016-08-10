module.exports = Object.assign( { }, require('./__proto__'), {
    
    bcrypt: require('bcrypt'),

    DELETE: [ function() { return this.notFound() } ],

    GET: [
        function() {
            if( this.path.length !== 3 ) return this.notFound()

            return this.Postgres.query( "SELECT id, email FROM person where id = $1", [ this.path[1] ] )
            .then( result => result.rows.length === 1 ? Promise.resolve( result ) : this.notFound( true ) )
            .then( result => Promise.all( [ Promise.resolve( result ), this.P( this.bcrypt.compare, [ result.rows[0].email, this.path[2] ] ) ] ) )
            .then( ( [ result, isValid ] => this.Postgres.query( `UPDATE person SET "hasEmailValidated" = true WHERE id = ${result.rows[0].id}` ) ) )
            .then( () => this.respond( { body: { success: true } } )

        }, function() { return this.respond( { body: this.user } ) } ],

    PATCH: [ function() { return this.notFound() }, ],

    POST: [ function() { return this.notFound() } ]

} )
