module.exports = {

    "__proto__": {

        constructor(err) { return this.handle(err) },
    
        handle: function( err ) { console.log( err.stack || err ) }
    }
}
