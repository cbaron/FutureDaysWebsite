module.exports = Object.create(

    Object.assign( {}, ( require('./lib/MyObject') ), {

        //Postgres: require('./dal/postgres'),

        applyResource( request, response, path, dir, file ) {
        
            return new Promise( ( resolve, reject ) => {

                require('fs').stat( this.format( '%s/%s.js', __dirname, file ), err => {
                    var instance

                    if( err ) { 
                        if( err.code !== "ENOENT" ) return reject( err )
                        file = this.format( '%s/__proto__', dir )
                    }

                    instance = Object.create( require(file), {
                        request: request,
                        response: response,
                        path: path,
                        tables: this.tables,
                    } )

                    if( !instance[ request.method ] ) { this.handleFailure( response, new Error("Not Found"), 404, false ); return resolve() }

                    instance[ request.method ]().then( resolve ).catch( reject )
                } )
            } )
        },

        constructor() {
            /*
            this.storeTableData()
                .storeTableMetaData()
                .storeForeignKeyData()
            */

            return this.handler.bind(this)
        },
    
        fs: require('fs'),

        handleFailure( response, err, code, log ) {

            var message = ( process.env.NODE_ENV === "production" ) ? "Unknown Error" : err.stack || err.toString()

            if( log ) console.log( err.stack || err )

            response.writeHead( code || 500, {
                "Content-Length": Buffer.byteLength( message ),
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, must-revalidate'
            } )

            response.end( message )
        },

        handler( request, response ) {
            var path, resource

            if( ! this.resources[ request.method ] ) return this.handleFailure( response, new Error("Not Found"), 404, false )

            request.setEncoding('utf8')

            path = this.url.parse( request.url ).pathname.split("/")

            resource = this.resources[ request.method ].find( resource => {
                if( ! resource.condition.call( this, request, path ) ) return false
            
                this[ resource.method ]( request, response, path )
                .catch( err => this.handleFailure( response, err, 500, true ) )
                return true
            } )

            if( ! resource ) return this.handleFailure( response, new Error("Not Found"), 404, false )
        },

        html( request, response, path ) {
            return new Promise( ( resolve, reject ) => {
                response.writeHead( 200 )
                response.end( require('./templates/page')( {
                    isDev: ( process.env.ENV === 'development' ) ? true : false,
                    title: 'Future Days'
                } ) )
                resolve()
            } )
        },

        hyper( request, response, path ) { return this.applyResource( request, response, './resources/hyper', path[1] || 'index' ) },

        pgQuerySync( query, args ) { return Object.create( this.Postgres.proto, { connectionString: { value: process.env.POSTGRES } } ).querySync( query, args ) },

        resources: {
            "DELETE": [ this.RESThandler ],

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
                }
            ],
            
            "PATCH": [ this.RESTHandler ],

            "POST": [ this.RESTHandler ],
    
            "PUT": [ this.RESTHandler ],
        },

        rest( request, response, path ) { return this.applyResource( request, response, './resources/rest', path[1] ) },

        RESTHandler: {
            condition: ( request, path ) => /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] ),
            method: 'rest'
        },

        static( request, response, path ) {
            //request.addListener( 'end', this.serveStaticFile.bind( this, request, response ) ).resume() 
            //return new Promise( resolve => resolve )

            var file = this.format( '%s%s', __dirname, path.join('/') )

            return new Promise( ( resolve, reject ) => {
                this.fs.stat( file, ( err, stat ) => {
                    var stream
                    if( err ) return reject(err) 
                    stream = this.fs.createReadStream( file )
                    response.on( 'error', err => { console.log( err ); stream.end() } )
                    response.writeHead( 200, { 'Connection': 'keep-alive', 'Content-Length': stat.size } )
                    stream.pipe( response )
                    resolve()
                } )
            } )
        },

        storeForeignKeyData() {
            this.pgQuerySync( this.Postgres.Queries.selectForeignKeys() ).forEach( row => {
                var match = /FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\)/.exec( row.pg_get_constraintdef )
                    column = this.tables[ row.table_from ].columns.find( column => column.name === match[1] )
               
                column.fk = {
                    table: match[2],
                    column: match[3],
                    recorddescriptor: ( this.tables[ match[2] ].meta ) ? this.tables[ match[2] ].meta.recorddescriptor : null
                }
            } )

            return this
        },

        storeTableData( tableResult ) {
            this.pgQuerySync( this.Postgres.Queries.selectAllTables() ).forEach( row => {
                 var columnResult = this.pgQuerySync( this.Postgres.Queries.selectTableColumns( row.table_name ) )
                 this.tables[ row.table_name ] =
                    { columns: columnResult.map( columnRow => ( { name: columnRow.column_name, range: this.Postgres.dataTypeToRange[columnRow.data_type] } ) ) } 
             } )

            return this
        },
        
        /*storeTableMetaData() {
            this.pgQuerySync( "SELECT * FROM tablemeta" ).forEach( row => {
                if( this.tables[ row.name ] ) this.tables[ row.name ].meta = this._( row ).pick( [ 'label', 'description', 'recorddescriptor' ] )
            } )

            return this
        },*/

        url: require('url')

    } ),

    { tables: { value: {} } }
).constructor()
