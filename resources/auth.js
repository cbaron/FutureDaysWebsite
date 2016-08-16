module.exports = Object.assign( { }, require('./__proto__'), {

    bcrypt: require('bcrypt'),
    
    DELETE: [ function() { return this.notFound() } ],
    
    GET: [ function() { return this.notFound() } ],

    PATCH: [ function() { return this.notFound() } ],

    POST: [
        function() { 
            var invalid = error => this.respond( { stopChain: true, body: { error }, code: 500 } )

            return this.Validate.slurpBody( this )
            .then( () =>
                ( !this.body.email || !this.body.password )
                    ? invalid('Email, password required.')
                    : this.Postgres.query( `SELECT id, name, email, password FROM person WHERE email = $1 AND "hasEmailValidated" = true`, [ this.body.email ] )
            )
            .then( result => {
                var person = result.rows.length !== 1 ? undefined : result.rows[0],
                    password

                if( ! person ) return invalid('Invalid Credentials')

                password = person.password
                delete person.password

                return this.P( this.bcrypt.compare, [ this.body.password, password ] )
                .then( checkedOut =>
                        checkedOut
                            ? Promise.all( [ this.makeToken( person ), Promise.resolve( person ) ] )
                            : invalid('Invalid Credentials')
                )
            } )
            .then( ( [ token, user ] ) =>
                this.respond( {
                    body: user,
                    headers: {
                        'Set-Cookie': `${process.env.COOKIE}=${token}; Expires=${new Date( new Date().getTime() + ( 60 * 60 * 24 * 30 * 1000 ) ).toUTCString()}`
                    }
                } )
            )
        }
    ]

} )
