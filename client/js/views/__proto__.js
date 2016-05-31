module.exports = Object.assign( { }, ( require('../../../lib/MyObject') ), Object.getPrototypeOf( require('events').EventEmitter ), {

    $: require('jquery'),

    Collection: require('backbone').Collection,
    
    Model: require('backbone').Model,

    constructor() {

        if( ! this.container ) this.container = this.$('#content')
        
        if( this.size ) this.$(window).resize( this._.throttle( () => this.size(), 500 ) )

        if( this.requiresLogin && !this.user.id ) { require('./Login').show().once( "loggedIn", () => this.onLogin() ); return this }

        if( this.user.id && this.requiresRole ) return this[ ( this.hasPrivileges() ) ? 'render' : 'showNoAccess' ]()
        
        return this.render()
    },

    delegateEvents( key, el ) {
        var type;

        if( ! this.events[ key ] ) return

        type = Object.prototype.toString.call( this.events[key] );

        if( type === '[object Object]' ) {
            this.bindEvent( key, this.events[key], el );
        } else if( type === '[object Array]' ) {
            this.events[key].forEach( singleEvent => this.bindEvent( key, singleEvent, el ) )
        }
    },

    delete: function() {
        this.templateData.container.remove()
        this.emit("removed")
    },

    getFormData: function() {
        this.formData = { }

        Object.keys( this.templateData, key => {
            if( /INPUT|TEXTAREAD/.test( this.templateData[ key ].prop("tagName") ) ) this.formData[ key ] = this.templateData[ key ].val()
        } )

        return this.formData
    },

    getTemplateOptions: () => ({}),

    hasPrivilege() {
        ( this.requiresRole && ( this.user.get('roles').find( role => role === this.requiresRole ) === "undefined" ) ) ? false : true
    },

    hide( duration ) {
        return new Promise( ( resolve, reject ) => this.templateData.container.hide( duration || 10, resolve ) )
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

    postRender: function() { return this },

    render() {

        this.slurpTemplate( {
            template: this.template( this.getTemplateOptions() ),
            insertion: { $el: this.insertionEl || this.container, method: this.insertionMethod } } )

        if( this.size ) this.size()

        this.renderSubviews()

        return this.postRender()
    },

    renderSubviews: function() {
        Object.keys( this.subviews || [ ] ).forEach( key => 
            this.subviews[ key ].forEach( subviewMeta => {
                this[ subviewMeta.name ] = new subviewMeta.view( { container: this.templateData[ key ] } ) } ) )
    },

    show: function( duration ) {
        return new Promise( ( resolve, reject ) => this.templateData.container.show( duration || 10, () => { this.size(); resolve() } ) )
    },

    slurpEl: function( el ) {

        var key = el.attr('data-js');

        this.templateData[ key ] = ( this.templateData.hasOwnProperty(key) ) ? this.templateData[ key ].add( el ) : el

        el.removeAttr('data-js');

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate: function( options ) {

        var $html = this.$( options.template ),
            selector = '[data-js]';

        if( this.templateData === undefined ) this.templateData = { };

        $html.each( ( index, el ) => {
            var $el = this.$(el);
            if( $el.is( selector ) ) this.slurpEl( $el )
        } );

        $html.get().forEach( ( el ) => { this.$( el ).find( selector ).each( ( i, elToBeSlurped ) => this.slurpEl( this.$(elToBeSlurped) ) ) } )
       
        if( options && options.insertion ) options.insertion.$el[ ( options.insertion.method ) ? options.insertion.method : 'append' ]( $html )

        return this;
    },
    
    bindEvent: function( elementKey, eventData, el ) {
        var elements = ( el ) ? el : this.templateData[ elementKey ];

        elements.on( eventData.event || 'click', eventData.selector, eventData.meta, this[ eventData.method ].bind(this) )
    },

    events: {},

    isMouseOnEl: function( event, el ) {

        var elOffset = el.offset(),
            elHeight = el.outerHeight( true ),
            elWidth = el.outerWidth( true );

        if( ( event.pageX < elOffset.left ) ||
            ( event.pageX > ( elOffset.left + elWidth ) ) ||
            ( event.pageY < elOffset.top ) ||
            ( event.pageY > ( elOffset.top + elHeight ) ) ) {

            return false;
        }

        return true;
    },

    requiresLogin: false,
    
    size: () => { this },

    user: require('../models/User'),

    util: require('util')

} )
