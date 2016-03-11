module.exports = {

    "__proto__": Object.assign( {}, Object.getPrototypeOf( require('../lib/MyObject') ), {

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
            var client = new this._pgNative()
            client.connectSync( this.connectionString )
            return client.querySync( query, args )
        }

    } )
}
