module.exports = Object.assign( { }, require('./__proto__'), {

    bcrypt: require('bcrypt'),

    email: require('../lib/Email'),

    POST: [
        function() {
            return this.Validate.apply(this)
            .then( () =>
                this.Postgres.query( "SELECT id FROM person WHERE email = $1", [ this.body.email ] )
                .then( result =>
                    result.rows.length === 0
                        ? Promise.resolve()
                        : this.respond( { stopChain: true, body: { error: 'Email Already Registered' }, code: 500 } )
                )
            )
            .then( () => {
                delete this.body.repeatPassword
                return this.P( this.bcrypt.hash, [ this.body.password, parseInt( process.env.SALT ) ] )
            } )
            .then( ( [ hash ] ) => Promise.resolve( this.body.password = hash ) )
            .then( () => this.Db.apply(this) )
            .then( result => 
                this.makeToken( { id: result.rows[0].id, email: this.body.email } )
                .then( token =>
                    this.email.send( {
                        to: this.body.email,
                        from: process.env.EMAIL_FROM,
                        subject: `${process.env.NAME} Email Verification`,
                        body:
                            `${this.body.name}, welcome to ${process.env.NAME}! ` +
                            `Click the link to verify your email : ` +
                            `https://${process.env.DOMAIN}:${process.env.PORT}/verify/${token}`

                    } )
                )
            )
            .then( () => this.respond( { body: { } } ) )
        }
    ]
} )



