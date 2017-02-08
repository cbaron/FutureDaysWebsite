module.exports = Object.assign( {}, require('./__proto__'), {

    events: {
        'logo': 'click',
        'navLinks': { event: 'click', selector: 'li' }
    },

    onLogoClick() { this.emit( 'navigate', 'home' ) },

    onNavLinksClick( e ) {
        const route = e.target.getAttribute('data-id')     
        this.emit( 'navigate', route )
    },

    onUser() {
        return this
    }

} )
