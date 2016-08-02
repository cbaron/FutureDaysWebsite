module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        signoutBtn: { method: 'signout' }
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
