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

        if( this.requiresLogin && (!this.user.data || !this.user.data.id ) ) return this.handleLogin()

        if( this.user.data && this.user.data.id && this.requiresRole && !this.hasPrivileges() ) return this.showNoAccess()
        
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view' }, views: { } } ).render()
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
            this.else.container.remove()
            this.emit("removed")
            return Promise.resolve()
        } )
    },

    events: {},

    getTemplateOptions: () => ({}),

    handleLogin() {
        this.factory.create( 'login', { insertion: { value: { $el: this.$('#content') } } } )
            .once( "loggedIn", () => this.onLogin() )

        return this
    },

    hasPrivilege() {
        ( this.requiresRole && ( this.user.get('roles').find( role => role === this.requiresRole ) === "undefined" ) ) ? false : true
    },

    hide( duration ) {
        return new Promise( resolve => this.els.container.hide( duration || 10, resolve ) )
    },
    
    isHidden() { return this.els.container.css('display') === 'none' },

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

        return this.renderSubviews()
                   .postRender()
    },

    renderSubviews() {
        Object.keys( this.Views || [ ] ).forEach( key => {
            if( this.Views[ key ].el ) {
                let opts = this.Views[ key ].opts
                
                opts = ( opts )
                    ? typeof opts === "object"
                        ? opts
                        : opts()
                    : {}

                this.views[ key ] = this.factory.create( key, Object.assign( { insertion: { value: { $el: this.Views[ key ].el, method: 'before' } } }, opts ) )
                this.Views[ key ].el.remove()
                this.Views[ key ].el = undefined
            }
        } )

        return this
    },

    show( duration ) {
        return new Promise( ( resolve, reject ) =>
            this.els.container.show(
                duration || 10,
                () => { if( this.size ) { this.size(); } resolve() }
            )
        )
    },

    slurpEl( el ) {
        var key = el.attr( this.slurp.attr ) || 'container'

        if( key === 'container' ) el.addClass( this.name )

        this.els[ key ] = this.els[ key ] ? this.els[ key ].add( el ) : el

        el.removeAttr(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate( options ) {

        var $html = this.$( options.template ),
            selector = `[${this.slurp.attr}]`,
            viewSelector = `[${this.slurp.view}]`

        $html.each( ( i, el ) => {
            var $el = this.$(el);
            if( $el.is( selector ) || i === 0 ) this.slurpEl( $el )
        } )

        $html.get().forEach( ( el ) => {
            this.$( el ).find( selector ).each( ( undefined, elToBeSlurped ) => this.slurpEl( this.$(elToBeSlurped) ) )
            this.$( el ).find( viewSelector ).each( ( undefined, viewEl ) => {
                var $el = this.$(viewEl)
                this.Views[ $el.attr(this.slurp.view) ].el = $el
            } )
        } )
       
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

    requiresLogin: false,

    somethingWentWrong( e ) {
        console.log( e.stack || e )
    },

    //__toDo: html.replace(/>\s+</g,'><')
} )
