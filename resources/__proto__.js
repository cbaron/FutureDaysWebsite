module.exports = Object.assign( { }, require('../lib/MyObject'), {

    Context: require('./.Context'),
    
    Db: require('./.Db'),
    
    Postgres: require('../dal/Postgres'),

    Response: require('./.Response'),
    
    Validate: require('./.Validate'),
    
    apply( method ) { return this.createChain( method ).callChain },

    createChain( method ) {
        var start
            
        this.callChain = new Promise( resolve => start = resolve );

        ( this[ method ] ) 
            ? this[ method ].forEach( fun => this.callChain = this.callChain.then( result => fun.call( this, result ) ) )
            : [ this.Validate.apply, this.Context.apply, this.Db.apply, this.Response.apply ]
              .forEach( fun => this.callChain = this.callChain.then( result => fun( this, result ) ) )

        start();

        return this
    },

    createCookie() {
        return new Promise( ( resolve, reject ) => {
            require('jws').createSign( {
                header: { "alg": "HS256", "typ": "JWT" },
                payload: JSON.stringify( this.user ),
                privateKey: process.env.JWS_SECRET,
            } )
            .on( 'done', signature => resolve( signature ) )
            .on( 'error', e => { this.user = { }; return resolve() } )
        } )
    },

    end( data ) {
        return new Promise( resolve => {
            data.body = JSON.stringify( data.body )
            this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
            this.response.end( data.body )
            resolve()
        } )
    },

    getHeaders( body ) { return Object.assign( {}, this.headers, { 'Date': new Date().toISOString(), 'Content-Length': Buffer.byteLength( body ) } ) },

    headers: {
        'Connection': 'Keep-Alive',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Keep-Alive': 'timeout=50, max=100'
    },

    notFound( stopChain=false ) { return this.respond( { stopChain, code: 404 } ) },

    respond( data ) {
        data.body = JSON.stringify( data.body )
        this.response.writeHead( data.code || 200, Object.assign( this.getHeaders( data.body ), data.headers || {} ) )
        this.response.end( data.body )
        if( data.stopChain ) { this.handled = true; throw new Error("Handled") }
    }
} )
