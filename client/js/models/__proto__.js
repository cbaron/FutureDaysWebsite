module.exports = Object.assign( { }, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    Xhr: require('../Xhr'),

    get() {
        return this.Xhr( { method: 'get', resource: this.resource } )
        .then( response => Promise.resolve( this.data = response ) )
    }

} )
