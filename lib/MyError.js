module.exports = class MyError {

    constructor(err) { return this.handle(err) }

    handle( err ) { console.log( err.stack || err ) }
}
