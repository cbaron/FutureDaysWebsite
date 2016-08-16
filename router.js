var RESTHandler = {
    condition( request, path ) { return /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[0] ] || this.Postgres.tables[ path[0] ] ) },
    method: 'rest'
}

module.exports = Object.create(

    Object.assign( {}, require('./lib/MyObject'), {

        FS: require('fs'),

        Path: require('path'),

        Postgres: require('./dal/Postgres'),

        applyResource( request, response, path, parsedUrl, dir, file ) {

            return this.P( this.FS.stat, [ `${__dirname}/${dir}/${file}.js` ] )
            .catch( e => ( e.code !== "ENOENT" ) ? Promise.reject(e) : Promise.resolve( file = `${dir}/__proto__` ) )
            .then( () => {

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
            this.isDev = ( process.env.ENV === 'development' )
            this.Postgres.getTableData()

            return this.handler.bind(this)
        },

        handleFailure( response, err, log ) {

            var message

            if( err.message === "Handled" ) return
            
            message = process.env.NODE_ENV === "production" ? "Unknown Error" : err.stack || err.toString()

            if( log ) this.Error( err )

            response.writeHead( err.statusCode || 500, {
                "Content-Length": Buffer.byteLength( message ),
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            } )

            response.end( message )
        },

        handler( request, response ) {
            var parsedUrl,
                path,
                routeFound,
                notFound = { body: "Not Found", statusCode: 404 }

            if( ! this.resources[ request.method ] ) return this.handleFailure( response, notFound, false )

            request.setEncoding('utf8')

            parsedUrl = require('url').parse( request.url )
            path = parsedUrl.pathname.split("/").slice(1)

            routeFound = this.resources[ request.method ].find( resource => {
                if( ! resource.condition.call( this, request, path ) ) return false
            
                this[ resource.method ]( request, response, path, parsedUrl )
                .catch( err => this.handleFailure( response, err, true ) )
                return true
            } )

            if( ! routeFound ) return this.handleFailure( response, { body: "Not Found", statusCode: 404 }, false )
        },

        html( request, response, path ) {
            response.writeHead( 200 )
            response.end( require('./templates/page')( {
                isDev: this.isDev,
                title: 'Future Days'
            } ) )
            return Promise.resolve()
        },

        hyper( request, response, path ) { return this.applyResource( request, response, path, parsedUrl, './resources/hyper', path[0] || 'index' ) },

        resources: {
            "DELETE": [ RESTHandler ],

            "GET": [
                {
                    condition: ( request, path ) => ( path[0] === "static" ) || path[0] === "favicon.ico",
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

        rest( request, response, path, parsedUrl ) { return this.applyResource( request, response, path, parsedUrl, './resources', path[0] ) },

        static( request, response, path ) {
            var fileName = path.pop()
                filePath = `${__dirname}/${path.join('/')}/${fileName}`
           
            return this.P( this.FS.stat, [ filePath ] )
            .then( ( [ stat ] ) => {
                var stream = this.FS.createReadStream( filePath )
                response.on( 'error', err => { console.log( err.stack || err ); stream.end() } )
                response.writeHead(
                    200,
                    {
                        'Connection': 'keep-alive',
                        'Content-Encoding': this.Path.extname( filePath ) === ".gz" ? 'gzip' : 'identity',
                        'Content-Length': stat.size,
                        'Content-Type': /\.css/.test(fileName) ? 'text/css' : 'text/plain'
                    }
                )
                stream.pipe( response )
                return Promise.resolve()
            } )
        }

    } ), { routes: { value: { REST: { auth: true, user: true, verify: true } } } }
).constructor()
