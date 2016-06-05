module.exports = {

    apply( resource ) { return this[ resource.request.method ]( resource ) },

    DELETE(){},

    GET( resource ) {

        resource.query = require('querystring').parse( resource.parsedUrl.query )

        Object.keys( resource.query ).forEach( attr => {
            var value = resource.query[ attr ]

            if( /^({|\[)/.test(value) ) {
                resource.query[ attr ] = JSON.parse( value )
                
                if( typeof resource.query[ attr ] === "object" && (! [ '<', '>', '<=', '>=', '=', '<>', '!=' ].includes( resource.query[ attr ].operation ) ) ) {
                    throw new Error('Invalid Parameter') }
            }
        } )
    },

    PATCH( resource ) { [ 'id' ].forEach( key => { if( resource.body[ key ] ) delete resource.body[key] } ) },

    POST(){}   
}
