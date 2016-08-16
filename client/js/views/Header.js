module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'links': { event: 'click', selector: 'li', method: 'navigate' },
        'signoutBtn': { method: 'signout' }
    },

    insertionMethod: 'before',

    navigate( e ) {
        var id = this.$( e.currentTarget ).attr( 'data-id' )
        console.log(id)
        console.log(this)        
        this.router.navigate( id, { trigger: true } )
    },

    onUser( user ) {
        this.user = user
        return this
    },
    
    signout() {

        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        this.user.clear()

        this.emit('signout')

        this.router.navigate( "/", { trigger: true } )
    }

} )
