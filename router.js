var RESTHandler = {
    condition( request, path ) { return /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.Postgres.tables[ path[1] ] ) },
    method: 'rest'
}

module.exports = Object.create(

    Object.assign( {}, require('./lib/MyObject'), {

        FS: require('fs'),

        Postgres: require('./dal/Postgres'),

        applyResource( request, response, path, parsedUrl, dir, file ) {

            console.log( "AWEAWE" )
        
            return this.P( this.FS.stat, [ `${__dirname}/${dir}/${file}.js` ] )
            .catch( e => ( e.code !== "ENOENT" ) ? Promise.reject(e) : Promise.resolve( file = `${dir}/__proto__` ) )
            .then( () => {

                console.log( `${dir}/${file}` )
                return Object.create( require(`${dir}/${file}`), {
                    request: { value: request },
                    response: { value: response },
                    path: { value: path },
                    parsedUrl: { value: parsedUrl },
                    tables: { value: this.Postgres.tables }
                } ).apply( request.method )

            } )
        },

        constructor() {
            this.Postgres.getTableData()

            return this.handler.bind(this)
        },

        handleFailure( response, err, code, log ) {

            var message = ( process.env.NODE_ENV === "production" ) ? "Unknown Error" : err.stack || err.toString()

            if( log ) this.Error( err )

            response.writeHead( code || 500, {
                "Content-Length": Buffer.byteLength( message ),
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            } )

            response.end( message )
        },

        handler( request, response ) {
            var parsedUrl,
                path,
                routeFound

            if( ! this.resources[ request.method ] ) return this.handleFailure( response, new Error("Not Found"), 404, false )

            request.setEncoding('utf8')

            parsedUrl = require('url').parse( request.url )
            path = parsedUrl.pathname.split("/")

            routeFound = this.resources[ request.method ].find( resource => {
                if( ! resource.condition.call( this, request, path ) ) return false
            
                this[ resource.method ]( request, response, path, parsedUrl )
                .catch( err => this.handleFailure( response, err, 500, true ) )
                return true
            } )

            if( ! routeFound ) return this.handleFailure( response, new Error("Not Found"), 404, false )
        },

        html( request, response, path ) {
            response.writeHead( 200 )
            response.end( require('./templates/page')( {
                isDev: ( process.env.ENV === 'development' ) ? true : false,
                title: 'Future Days'
            } ) )
            return Promise.resolve()
        },

        hyper( request, response, path ) { return this.applyResource( request, response, path, parsedUrl, './resources/hyper', path[1] || 'index' ) },

        resources: {
            "DELETE": [ RESTHandler ],

            "GET": [
                {
                    condition: ( request, path ) => ( path[1] === "static" ) || path[1] === "favicon.ico",
                    method: 'static'
                }, {
                    condition: ( request, path ) => /text\/html/.test( request.headers.accept ),
                    method: 'html'
                }, {
                    condition: ( request, path ) => /application\/ld\+json/.test( request.headers.accept ),
                    method: 'hyper'
                },
                RESTHandler
            ],
            
            "PATCH": [ RESTHandler ],

            "POST": [ RESTHandler ],
    
            "PUT": [ RESTHandler ],
        },

        rest( request, response, path, parsedUrl ) { console.log("okay"); return this.applyResource( request, response, path, parsedUrl, './resources', path[1] ) },

        static( request, response, path ) {
            var file = `${__dirname}${path.join('/')}`

            return this.P( this.FS.stat, [ file ] )
            .then( ( [ stat ] ) => {
                var stream = this.FS.createReadStream( file )
                response.on( 'error', err => { console.log( err ); stream.end() } )
                response.writeHead( 200, { 'Connection': 'keep-alive', 'Content-Length': stat.size } )
                stream.pipe( response )
                return Promise.resolve()
            } )
        }

    } ), { routes: { value: { REST: { user: true } } } }
).constructor()
