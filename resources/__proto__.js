module.exports = Object.assign( { }, require('../lib/MyObject'), {

    Postgres: require('../dal/Postgres'),

    apply( method ) { return this.createChain( method ).callChain },

    context: Object.create( require('./_util/Context') ),

    chains: { },

    createChain( method ) {

        if( ! this.chains[ method ] ) return this.getDefaultChain( method )
 
        this.chains[ method ].forEach( fun => {
            this.callChain = this.callChain.then( () => fun.call(this) )
        } )

        return this
    },

    getDefaultChain( method ) {
        if( /(PATCH|POST)/.test( method ) ) this.callChain = this.callChain.then( () => this.slurpBody() )

        [ this.validate.apply, this.context.apply, this.Postgres.REST, this.response ].forEach( fun => this.callChain = this.callChain.then( () => fun(this) ) )
        
        return this
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=50, max=100',
    },

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

    validate: Object.create( require('./_util/Validate') )

} )
