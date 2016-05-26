var MyObject = require('../../../../lib/MyObject'),
    Collections = function() {
        this.collections = { }
        return MyObject.apply( this, arguments )
    }

Object.assign( Collections.prototype, MyObject.prototype, {

    addCollection: function( id ) {
        var collection,
            extension = { parse: response => response.result, url: this.url }
       
        if( this.comparator ) extension.comparator = this.comparator
        if( this.model ) extension.model = this.model

        collection = new ( require('backbone').Collection.extend( extension ) )()
                
        this.collections[ id ] = collection

        return this.Q( collection.fetch( { data: { [this.key]: id }, headers: { token: this.user.get('token') } } ) )
        .then( () => collection )
    },

    getCollection: function( id ) {
        return this.Q.Promise( function( resolve, reject ) {

            if( this.collections[ id ] ) return resolve( this.collections[ id ] )

            this.addCollection( id ).then( collection => resolve( collection ) )
            .fail( err => reject( new Error( "Error fetching collection: " + err.stack || err ) ) )
            .done()

        }.bind(this) )
            
    }

} )

module.exports = Collections
