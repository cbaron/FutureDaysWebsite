module.exports = Object.assign( { }, require('../lib/MyObject'), {

    Postgres: require('../dal/Postgres').REST,

    Context: Object.create( require('./_util/Context') ),
    
    Db: Object.create( require('./_util/Db') ),
    
    Response: Object.create( require('./_util/Response') ),

    Validate: Object.create( require('./_util/Validate') ),
    
    apply( method ) { return this.createChain( method ).callChain },

    chains: { },

    createChain( method ) {

        if( ! this.chains[ method ] ) return this.getDefaultChain( method )
 
        this.chains[ method ].forEach( fun => this.callChain = this.callChain.then( fun.call(this) ) )

        return this
    },

    getDefaultChain( method ) {

        [ this.Validate.apply, this.Context.apply, this.Db.apply, this.Response.apply ].forEach(
            fun => this.callChain = this.callChain.then( result => fun( this, result ) ) )
        
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
    }
} )
