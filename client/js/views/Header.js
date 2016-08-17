module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'logo': 'click',
        'navLinks': { event: 'click', selector: 'li' }
        //'signoutBtn': { method: 'signout' }
    },

    onLogoClick() { this.emit( 'route', 'home' ) },

    onNavLinksClick( e ) {
        var resource = this.$( e.currentTarget ).attr( 'data-id' )     
        this.emit( 'route', resource )
    },

    onUser() {
        return this
    },
    
    /*signout() {

        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

        this.user.clear()

        this.emit('signout')

        this.router.navigate( "/", { trigger: true } )
    }*/

} )
