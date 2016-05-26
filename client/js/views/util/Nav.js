var MyView = require('../MyView'),
    Nav = function() { return MyView.apply( this, arguments ) }

Object.assign( Nav.prototype, MyView.prototype, {

    events: {
        'hamburger': { event: 'click', selector: '', method: 'toggleLogo' },
        'headerTitle': { event: 'click', selector: '', method: 'navigate' },
        'home': { event: 'click', selector: '', method: 'navigate' },
        'about': { event: 'click', selector: '', method: 'navigate' },
        'csa': { event: 'click', selector: '', method: 'navigate' },
        'markets': { event: 'click', selector: '', method: 'navigate' },
        'sign-up': { event: 'click', selector: '', method: 'navigate' },
        'members': { event: 'click', selector: '', method: 'navigate' },
        'get-involved': { event: 'click', selector: '', method: 'navigate' },
        'contact': { event: 'click', selector: '', method: 'navigate' }
    },

    fields: [
            { label: 'About Us', name: 'about' },
            { label: 'CSA Program', name: 'csa' },
            { label: 'Markets', name: 'markets' },
            { label: 'Sign-Up', name: 'sign-up' },
            //{ label: 'Member Resources', name: 'members' },
            { label: 'Get Involved', name: 'get-involved' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields, home: this.home } },

    home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' },

    requiresLogin: false,

    navigate( e ) {
        var id = this.$( e.currentTarget ).attr( 'data-id' )        
        this.router.navigate( id, { trigger: true } )
    },

    toggleLogo() { this.$('.header-title').toggle() }

} )

module.exports = Nav
