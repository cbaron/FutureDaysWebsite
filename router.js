module.exports = Object.create(

    Object.assign( {}, Object.getPrototypeOf( require('./lib/MyObject') ), {

        constructor() {
        },

        fs: require('fs'),

        handler( request, response ) {
            var path

            if( ! this.resources[ request.method ] ) return this.handleFailure( response, new Error("Not Found"), 404, false )

            request.setEncoding('utf8')

            path = this.url.parse( request.url ).pathname.split("/")

            this.resources[ request.method ].some( resource => {
                if( ! resource.condition.call( this, request, path ) ) return false
            
                this[ resource.method ]( request, response, path )
                .catch( err => this.handleFailure( response, err, 500, true ) )
                return true
            } )

            

            if( ( request.method === "GET" && path[1] === "static" ) || path[1] === "favicon.ico" ) {
                return request.addListener( 'end', this.serveStaticFile.bind( this, request, response ) ).resume() }

            if( /text\/html/.test( request.headers.accept ) && request.method === "GET" ) {
                return this.applyHTMLResource( request, response, path ).catch( err => this.handleFailure( response, err, 500, true ) )

            } else if( ( /application\/json/.test( request.headers.accept ) || /(POST|PATCH|DELETE)/.test(request.method) ) &&
                       ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] ) ) {
                return this.applyResource( request, response, path ).catch( err => this.handleFailure( response, err, 500, true ) )
            } else if( /application\/ld\+json/.test( request.headers.accept ) && ( this.tables[ path[1] ] || path[1] === "" ) ) {
                if( path[1] === "" ) path[1] === "index"
                return this.applyResource( request, response, path, '/hyper' ).catch( err => this.handleFailure( response, err, 500, true ) )
            }

            return this.handleFailure( response, new Error("Not Found"), 404, false )
        },

        html( request, response, path ) {
            return new Promise( ( resolve, reject ) => {
                this.response.writeHead( 200 )
                this.response.end( require('./templates/page')( require('handlebars') )( { title: 'Future Days' } ) )
                resolve()
            } )
        },

        pgQuerySync: ( query, args ) =>
            new ( require('./dal/postgres') )( { connectionString: process.env.POSTGRES } ).querySync( query, args ),

        resources: {
            "DELETE: [
                condition: ( request, path ) => /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] )
                method: 'rest'
            ],

            "GET": [
                {
                    condition: ( request, path ) => ( path[1] === "static" ) || path[1] === "favicon.ico",
                    method: 'static'
                }, {
                    condition: ( request, path ) => /text\/html/.test( request.headers.accept )
                    method: 'html'
                }, {
                    condition: ( request, path ) => /application\/ld\+json/.test( request.headers.accept )
                    method: 'hyper'
                }
            ],
            
            "PATCH: [
                condition: ( request, path ) => /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] )
                method: 'rest'
            ],

            "POST: [
                condition: ( request, path ) => /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] )
                method: 'rest'
            ],
    
            "PUT: [
                condition: ( request, path ) => /application\/json/.test( request.headers.accept ) && ( this.routes.REST[ path[1] ] || this.tables[ path[1] ] )
                method: 'rest'
            ]
        },

        static( request, response, path ) {
            var file = this.format( '%s/%s', __dirname, path.join('/')

            return new Promise( ( resolve, reject ) => {
                this.fs.stat( file, err => {
                    var stream
                    if( err ) return reject(err) 
                    stream = this.fs.createReadStream( file )
                    response.on( 'error', err => stream.end() )
                    response.writeHead( 200, 'Content-Length': stat.size )
                    stream.pipe( response )
                    resolve()
                } )
            } )
        },

    } ),

    { tables: { } }
)

router = new Router( { routes: { REST: { } }, tables: { } } ).initialize()

Object.assign( Router.prototype, MyObject.prototype, {

    applyHTMLResource( request, response, path ) {
        return new Promise( ( resolve, reject ) => {

            var file = './resources/html'

            require('fs').stat( this.format( '%s/%s.js', __dirname, file ), err => {
                if( err ) reject( err )
                new ( require(file) )( { path: path, request: request, response: response } )[ request.method ]().catch( err => reject( err ) )
            } )
        } )
    },
    
    applyResource( request, response, path, subPath ) {

        var filename = ( path[1] === "" && subPath ) ? 'index' : path[1],
            file = this.format('./resources%s/%s', subPath || '', filename )

        return new Promise( ( resolve, reject ) => {

            require('fs').stat( this.format( '%s/%s.js', __dirname, file ), err => {
                var instance

                if( err ) { 
                    if( err.code !== "ENOENT" ) return reject( err )
                    file = this.format( './resources%s/__proto__', subPath || '' )
                }

                instance = new ( require(file) )( {
                    request: request,
                    response: response,
                    path: path,
                    tables: this.tables,
                } )

                if( !instance[ request.method ] ) { this.handleFailure( response, new Error("Not Found"), 404, false ); return resolve() }

                instance[ request.method ]().catch( err => reject( err ) )
            } )
        } )
    },

    dataTypeToRange: {
        "character varying": "Text",
        "date": "Date",
        "integer": "Integer",
        "money": "Float",
        "timestamp with time zone": "DateTime"
    },

    getAllTables() {
        return this.format(
            "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';" )
    },

    getTableColumns( tableName ) {
        return this.format(
            'SELECT column_name, data_type',
            'FROM information_schema.columns',
            this.format( "WHERE table_name = '%s';", tableName ) )
    },

    getForeignKeys() {
        return [
            "SELECT conrelid::regclass AS table_from, conname, pg_get_constraintdef(c.oid)",
            "FROM pg_constraint c",
            "JOIN pg_namespace n ON n.oid = c.connamespace",
            "WHERE contype = 'f' AND n.nspname = 'public';"
        ].join(' ')
    },

    handleFailure( response, err, code, log ) {

        var message = ( process.env.NODE_ENV === "production" ) ? "Unknown Error" : err.stack || err

        if( log ) console.log( err.stack || err );

        response.writeHead( code || 500, Object.assign( {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Keep-Alive': 'timeout=50, max=100',
            'Date': new Date().toISOString() }, { "Content-Length": Buffer.byteLength( message ) } ) )

        response.end( message )
    },
    
    

    initialize() {
        this.storeTableData( this._postgresQuerySync( this.getAllTables() ) )
        this.storeTableMetaData( this._postgresQuerySync( "SELECT * FROM tablemeta" ) )
        this.storeForeignKeyData( this._postgresQuerySync( this.getForeignKeys() ) )

        return this;
    },

    

    storeForeignKeyData( foreignKeyResult ) {
        foreignKeyResult.forEach( row => {
            var match = /FOREIGN KEY \((\w+)\) REFERENCES (\w+)\((\w+)\)/.exec( row.pg_get_constraintdef )
                column = this._( this.tables[ row.table_from ].columns ).find( column => column.name === match[1] )
           
            column.fk = {
                table: match[2],
                column: match[3],
                recorddescriptor: ( this.tables[ match[2] ].meta ) ? this.tables[ match[2] ].meta.recorddescriptor : null
            }
        } )
    },

    storeTableData( tableResult ) {
        tableResult.forEach( row => {
             var columnResult = this._postgresQuerySync( this.getTableColumns( row.table_name ) )
             this.tables[ row.table_name ] =
                { columns: columnResult.map( columnRow => ( { name: columnRow.column_name, range: this.dataTypeToRange[columnRow.data_type] } ) ) } 
         } )
    },
    
    storeTableMetaData( metaDataResult ) {
        metaDataResult.forEach( row => {
            if( this.tables[ row.name ] ) this.tables[ row.name ].meta = this._( row ).pick( [ 'label', 'description', 'recorddescriptor' ] )
         } )
    },

    url: require( 'url' )

} )


