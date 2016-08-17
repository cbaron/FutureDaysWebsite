module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'links': { event: 'click', selector: 'li' }
    },

    onLinksClick( e ) {
        var resource = this.$( e.currentTarget ).attr( 'data-id' )      
        this.emit( 'route', resource )
    },
} )
