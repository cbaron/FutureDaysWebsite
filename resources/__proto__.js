module.exports = Object.assign( { }, require('../lib/MyObject'), {

    Postgres: require('../dal/Postgres'),

    apply( method ) { return this.createChain( method ).callChain },

    context: {
        DELETE(){},

        GET() {
            this.query = require('querystring').parse( require('url').parse( this.request.url ).query )
            Object.keys( this.query ).forEach( attr => {
                if( this.query[ attr ].charAt(0) === '{' ) {
                    this.query[ attr ] = JSON.parse( this.query[ attr ] )
                    if( ! this._( [ '<', '>', '<=', '>=', '=', '<>', '!=' ] ).contains( this.query[ attr ].operation ) ) throw new Error('Invalid Parameter')
                } else if( attr === 'path' && this.query[ attr ].charAt(0) === '[' ) {
                    this.query[ attr ] = JSON.parse( this.query[ attr ] )
                }
            } )
        },

        PATCH() { this.body = this._.omit( this.body, [ 'id' ] ) },

        POST(){}
    },

    chains: { },

    createChain( method ) {
        console.log( this.chains )

        if( ! this.chains[ method ] ) return this.getDefaultChain( method )
 
        this.chains[ method ].forEach( fun => {
            console.log( fun )
            this.callChain = this.callChain.then( () => fun.call(this) )
        } )

        return this
    },

    getDefaultChain( method ) {
        if( /(PATCH|POST)/.test( method ) ) this.callChain = this.callChain.then( () => this.slurpBody() )

        [ this.validate, this.context, this.Postgres.REST, this.response ].forEach( fun => this.callChain = this.callChain.then( fun[ method ].bind(this) ) )
        
        return this
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=50, max=100',
    },

    jws: require('jws'),

    notFound() { this.respond( { code: 404 } ) },

    respond( data ) {
        data.body = JSON.stringify( data.body )
        this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body )
    },

    response: {
        
        DELETE() { this.respond( { body: { } } ) },

        GET( result ) {
            var body = ( this.path.length > 2 ) ? ( ( result.rows.length ) ? result.rows[0] : { } ) : result.rows
            return this.respond( { body: body } )
        },

        PATCH( result ) { this.respond( { body: result.rows[0] } ) },

        POST( result ) {
            this.respond( { body: result.row[0] } )
        }
    },

    slurpBody() {
        return new Promise( ( resolve, reject ) => {
            var body = ''
            
            this.request.on( "data", data => {
                body += someData

                if( this.body.length > 1e10 ) {
                    this.request.connection.destroy()
                    reject( new Error("Too much data") )
                }
            } )

            this.request.on( "end", () => {

                if( this.body.length === 0 ) this.body = "{}"

                try {
                    this.body = JSON.parse( body )
                } catch( e ) {
                    reject( 'Unable to parse request : ' + e )
                }
                
                resolve()
            } )
        } )
    },

    validate: {

        DELETE() {

            this.validate.Token.call(this)
            
            if( this.path.length !== 3 || Number.isNaN( parseInt( this.path[2], 10 ) ) ) throw new Error("Invalid resource id")

            return this.validate.User.call(this)
        },

        GET() {

            console.log("AD")

            this.validate.Token.call(this)

            if( this.path.length > 2 && Number.isNaN( parseInt( this.path[2], 10 ) ) ) throw new Error("Invalid resource id")
            
            return this.validate.User.call(this)
        },

        PATCH() {
            
            this.validate.Token.call(this)

            if( this.path.length !== 3 || Number.isNaN( parseInt( this.path[2], 10 ) ) ) throw new Error("Invalid resource id")

            return this.validate.User.call(this)
        },

        POST() {
            if( /(auth)/.test(this.path[1]) ) return
            
            if( this.path.length !== 2 ) throw new Error("Invalid Request")
            
            this.validate.Token.call(this)
            
            return this.validate.User.call(this)
        },
    
        Token() {
            if( ! this.request.headers.cookie ) return

            this.request.headers.cookie.split(';').forEach( cookie => {
                var parts = cookie.split('='),
                    name = parts.shift().trim()

                if( name === process.env.COOKIE ) this.token = parts.join('=')
            } )
        },

        User() {
            return new Promise( ( resolve, reject ) => {
                if( ! this.token ) { this.user = { }; return resolve() }
                this.jws.createVerify( {
                    algorithm: "HS256",
                    key: process.env.JWS_SECRET,
                    signature: this.token,
                } ).on( 'done', ( verified, obj ) => {
                    if( ! verified ) reject( 'Invalid Signature' )
                    this.user = obj.payload
                    resolve()
                } ).on( 'error', e => { this.user = { }; return resolve() } )
            } )
        }
    }
} )
