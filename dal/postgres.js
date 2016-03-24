module.exports = {

    proto: Object.assign( {}, Object.getPrototypeOf( require('../lib/MyObject') ), {

        Pg: require('pg'),

        PgNative: require('pg-native'),

        _connect() {
            return new Promise( ( resolve, reject ) => {
                this.Pg.connect( this.connectionString, ( err, client, done ) => {
                    if( err ) return reject( err )

                    this.client = client
                    this.done = done
                 
                    resolve()
                } )
            } )
        },

        _query( query, args ) {
            return new Promise( ( resolve, reject ) => {
                this.client.query( query, args, ( err, result ) => {
                    this.done()

                    if( err ) return reject( err )

                    resolve( result )
                } )
            } )
        },

        query( query, args ) {
            return this._connect()
                .then( () => this._query( query, args ) )
                .catch( e => this.Error(e) )
        },

        querySync( query, args ) {
            var client = new this.PgNative()
            client.connectSync( this.connectionString )
            return client.querySync( query, args )
        }

    } ),

    Queries: {

        format: require('util').format,
        
        selectAllTables() { return [
           "SELECT table_name",
           "FROM information_schema.tables",
           "WHERE table_schema='public'",
           "AND table_type='BASE TABLE';"
        ].join(' ') },

        selectForeignKeys() { return [
            "SELECT conrelid::regclass AS tableFrom, conname, pg_get_constraintdef(c.oid)",
            "FROM pg_constraint c",
            "JOIN pg_namespace n ON n.oid = c.connamespace",
            "WHERE contype = 'f' AND n.nspname = 'public';"
        ].join(' ') },

        selectTableColumns( tableName ) {
            return this.format(
                'SELECT column_name, data_type',
                'FROM information_schema.columns',
                this.format( "WHERE table_name = '%s';", tableName ) )
        },

    },

    dataTypeToRange: {
        "character varying": "Text",
        "date": "Date",
        "integer": "Integer",
        "money": "Float",
        "timestamp with time zone": "DateTime"
    }
}
