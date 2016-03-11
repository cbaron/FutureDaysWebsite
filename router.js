module.exports = {

    "__proto__": Object.assign( {}, Object.getPrototypeOf( require('./lib/MyObject') ), {

    } )

}

var router,
    MyObject = require('./lib/MyObject'),
    Router = function() { return MyObject.apply( this, arguments ) }

Object.assign( Router.prototype, MyObject.prototype, {

    _postgresQuerySync( query, args ) =>
        new ( require('./dal/postgres') )( { connectionString: process.env.POSTGRES } ).querySync( query, args ),

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
    
    handler( request, response ) {
        var path = this.url.parse( request.url ).pathname.split("/")
        request.setEncoding('utf8');

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

    initialize() {
        var static = require('node-static')

        this.storeTableData( this._postgresQuerySync( this.getAllTables() ) )
        this.storeTableMetaData( this._postgresQuerySync( "SELECT * FROM tablemeta" ) )
        this.storeForeignKeyData( this._postgresQuerySync( this.getForeignKeys() ) )

        this.staticFolder = new static.Server( undefined, { cache: false } )

        return this;
    },

    resources: {
        "GET":
            [
                {
                    condition: ( request, path ) => ( path[1] === "static" ) || path[1] === "favicon.ico",
                    method: 'static'
                }, {
                    condition: ( request, path ) => /text\/html/.test( request.headers.accept )
                    method: 'html'
                },
            ]
    },

    serveStaticFile( request, response ) { this.staticFolder.serve( request, response ) },

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

router = new Router( { tables: { } } ).initialize()

module.exports = router.handler.bind(router)
