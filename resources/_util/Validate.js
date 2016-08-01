module.exports = {

    DELETE( resource ) {
        if( resource.path.length !== 3 || Number.isNaN( parseInt( resource.path[2], 10 ) ) ) this.throwInvalid()

        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },

    GET( resource ) {
        if( resource.path.length > 2 && Number.isNaN( parseInt( resource.path[2], 10 ) ) ) this.throwInvalid()
        
        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },

    PATCH( resource ) {

        if( resource.path.length !== 3 || Number.isNaN( parseInt( resource.path[2], 10 ) ) ) this.throwInvalid()

        return this.slurpBody( resource ).then( () => this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) ) )
    },

    POST( resource ) {
        if( /(auth)/.test(resource.path[1]) ) return
        
        if( this.path.length !== 2 ) this.throwInvalid()
        
        return this.slurpBody( resource ).then( () => this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) ) )
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
                body += someData

                if( body.length > 1e10 ) {
                    response.request.connection.destroy()
                    reject( new Error("Too many bits") )
                }
            } )

            resource.request.on( "end", () => {
                try { body = JSON.parse( body ) }
                catch( e ) { reject( 'Unable to parse request : ' + e ) }
                resolve()
            } )
        } )
    },

    throwInvalid() { throw new Error("Invalid request") }
}
