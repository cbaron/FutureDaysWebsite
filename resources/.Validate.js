module.exports = Object.create( {

    DELETE( resource ) {
        if( resource.path.length !== 2 || Number.isNaN( parseInt( resource.path[1], 10 ) ) ) this.throwInvalid()

        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },

    GET( resource ) {
        if( resource.path.length > 1 && Number.isNaN( parseInt( resource.path[1], 10 ) ) ) this.throwInvalid()
        
        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },

    PATCH( resource ) {

        if( resource.path.length !== 2 || Number.isNaN( parseInt( resource.path[1], 10 ) ) ) this.throwInvalid()

        return this.slurpBody( resource ).then( () => this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) ) )
    },

    POST( resource ) {
        var name = resource.path[0]
        
        if( /(auth)/.test( name ) ) return
        
        if( resource.path.length !== 1 ) this.throwInvalid()
        
        return this.slurpBody( resource )
            .then( () => {
                var neededKey
                if( ! resource.Postgres.tables[ name ] ) return Promise.resolve()
                resource.Postgres.tables[ name ].columns.every( column => {
                    if( resource.body[ column.name ] === undefined && (!column.isNullable) ) { neededKey = column.name; return false }
                    return true
                } )
                if( neededKey ) return resource.respond( { stopChain: true, code: 500, body: { error: `${neededKey} required` } } )
                return Promise.resolve()
            } )
            .then( () => this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) ) )
    },
    
    apply( resource ) { return this[ resource.request.method ]( resource ) },

    parseCookies( cookies ) {
        var rv

        if( ! cookies ) return ''

        cookies.split(';').forEach( cookie => {
            var parts = cookie.split('='),
                name = parts.shift().trim()

            if( name === process.env.COOKIE ) rv = parts.join('=')
        } )

        return rv
    },

    parseSignature( resource, signature ) {
        return new Promise( ( resolve, reject ) => {
            if( ! signature ) { resource.user = { }; return resolve() }
            require('jws').createVerify( {
                algorithm: "HS256",
                key: process.env.JWS_SECRET,
                signature,
            } ).on( 'done', ( verified, obj ) => {
                if( ! verified ) reject( 'Invalid Signature' )
                resource.user = obj.payload
                resolve()
            } ).on( 'error', e => { resource.user = { }; return resolve() } )
        } )
    },

    slurpBody( resource ) {
        return new Promise( ( resolve, reject ) => {
            var body = ''
            
            resource.request.on( "data", data => {
                body += data

                if( body.length > 1e10 ) {
                    response.request.connection.destroy()
                    reject( new Error("Too many bits") )
                }
            } )

            resource.request.on( "end", () => {
                try { resource.body = JSON.parse( body ) }
                catch( e ) { reject( 'Unable to parse request : ' + e ) }
                resolve()
            } )
        } )
    },

    throwInvalid() { throw new Error("Invalid request") }
}, { } )
