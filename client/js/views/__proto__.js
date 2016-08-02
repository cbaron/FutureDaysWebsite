module.exports = Object.assign( { }, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    _: require('underscore'),

    $: require('jquery'),

    Collection: require('backbone').Collection,
    
    Model: require('backbone').Model,

    bindEvent( key, event, selector='' ) {
        this.els[key].on( 'click', selector, e => this[ `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` ]( e ) )
    },

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    constructor() {

        if( this.size ) this.$(window).resize( this._.throttle( () => this.size(), 500 ) )

        if( this.requiresLogin && !this.user.id ) return this.handleLogin()

        if( this.user && this.user.id && this.requiresRole && !this.hasPrivileges() ) return this.showNoAccess()
        
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js' } } ).render()
    },

    delegateEvents( key, el ) {
        var type = typeof this.events[key]

        if( type === "string" ) { this.bindEvent( key, this.events[key] ) }
        else if( Array.isArray( this.events[key] ) ) {
            this.events[ key ].forEach( eventObj => this.bindEvent( key, eventObj.event ) )
        } else {
            this.bindEvent( key, this.events[key].event )
        }
    },

    delete( duration ) {
        return this.hide( duration )
        .then( () => {
            this.templateData.container.remove()
            this.emit("removed")
            return Promise.resolve()
        } )
    },

    events: {},

    getTemplateOptions: () => ({}),

    handleLogin() {
        Object.create( require('./Login'), { class: { value: 'input-borderless' } } ).constructor().once( "loggedIn", () => this.onLogin() )

        return this
    },

    hasPrivilege() {
        ( this.requiresRole && ( this.user.get('roles').find( role => role === this.requiresRole ) === "undefined" ) ) ? false : true
    },

    hide( duration ) {
        return new Promise( ( resolve, reject ) => this.els.container.hide( duration || 10, resolve ) )
    },
    
    isHidden: function() { return this.templateData.container.css('display') === 'none' },

    onLogin() {
        this.router.header.onUser( this.user )

        this[ ( this.hasPrivileges() ) ? 'render' : 'showNoAccess' ]()
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    render() {
        this.slurpTemplate( { template: this.template( this.getTemplateOptions() ), insertion: this.insertion } )

        if( this.size ) this.size()

        this.renderSubviews()

        return this.postRender()
    },

    renderSubviews: function() {
        Object.keys( this.subviews || [ ] ).forEach( key => 
            this.subviews[ key ].forEach( subviewMeta => {
                this[ subviewMeta.name ] = new subviewMeta.view( { insertionEl: this.templateData[ key ] } ) } ) )
    },

    show( duration ) {
        return new Promise( ( resolve, reject ) => this.templateData.container.show( duration || 10, () => { this.size(); resolve() } ) )
    },

    slurpEl( el ) {
        var key = el.attr( this.slurp.attr ) || 'container'

        this.els[ key ] = this.els[ key ] ? this.els[ key ].add( el ) : el

        el.removeAttr(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate( options ) {

        var $html = this.$( options.template ),
            selector = `[${this.slurp.attr}]`

        $html.each( ( i, el ) => {
            var $el = this.$(el);
            if( $el.is( selector ) || i === 0 ) this.slurpEl( $el )
        } )

        $html.get().forEach( ( el ) => { this.$( el ).find( selector ).each( ( undefined, elToBeSlurped ) => this.slurpEl( this.$(elToBeSlurped) ) ) } )
       
        options.insertion.$el[ options.insertion.method || 'append' ]( $html )

        return this
    },

    isMouseOnEl( event, el ) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight( true ),
            elWidth = el.outerWidth( true )

        if( ( event.pageX < elOffset.left ) ||
            ( event.pageX > ( elOffset.left + elWidth ) ) ||
            ( event.pageY < elOffset.top ) ||
            ( event.pageY > ( elOffset.top + elHeight ) ) ) {

            return false;
        }

        return true
    },

    requiresLogin: false
} )
