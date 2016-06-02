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

        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },

    POST( resource ) {
        if( /(auth)/.test(resource.path[1]) ) return
        
        if( this.path.length !== 2 ) this.throwInvalid()
        
        return this.parseSignature( resource, this.parseCookies( resource.request.headers.cookie ) )
    },
    
    apply( resource ) { return this[ resource.request.method ]( resource ) },

    parseCookies( cookies ) {
        var rv

        if( ! cookie ) return ''

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

    throwInvalid() { throw new Error("Invalid request") }
}
