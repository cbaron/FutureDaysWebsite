var MyView = function( data ) { return Object.assign( this, data ).initialize() }

Object.assign( MyView.prototype, require('events').EventEmitter.prototype, {

    Collection: require('backbone').Collection,
    
    //Error: require('../MyError'),

    Model: require('backbone').Model,

    _: require('underscore'),

    $: require('jquery'),

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
        if( this.templateData && this.templateData.container ) {
            this.templateData.container.remove()
            this.emit("removed")
        }
    },

    format: {
        capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1)
    },

    getFormData: function() {
        this.formData = { }

        this._.each( this.templateData, ( $el, name ) => { if( $el.prop("tagName") === "INPUT" && $el.val() ) this.formData[name] = $el.val() } )

        return this.formData
    },

    getRouter: function() { return require('../router') },

    getTemplateOptions: () => ({}),

    /*hide() {
        return this.Q.Promise( ( resolve, reject ) => {
            this.templateData.container.hide()
            resolve()
        } )
    },*/

    initialize() {

        if( ! this.container ) this.container = this.$('#content')
        
        this.router = this.getRouter()

        //this.modalView = require('./modal')

        this.$(window).resize( this._.throttle( () => this.size(), 500 ) )

        if( this.requiresLogin && ! this.user.id ) {
            require('./Login').show().once( "success", e => {
                this.router.header.onUser( this.user )

                if( this.requiresRole && ( ! this._( this.user.get('roles') ).contains( this.requiresRole ) ) ) {
                    return alert('You do not have access')
                }

                this.render()
            } )
            return this
        } else if( this.user.id && this.requiresRole ) {
            if( ( ! this._( this.user.get('roles') ).contains( this.requiresRole ) ) ) {
                return alert('You do not have access')
            }
        }

        return this.render()
    },

    isHidden: function() { return this.templateData.container.css('display') === 'none' },

    
    moment: require('moment'),

    postRender: function() {
        this.renderSubviews()
        return this
    },

    //Q: require('q'),

    render() {
        this.slurpTemplate( {
            template: this.template( this.getTemplateOptions() ),
            insertion: { $el: this.insertionEl || this.container, method: this.insertionMethod } } )

        this.size()

        this.postRender()

        return this
    },

    renderSubviews: function() {
        Object.keys( this.subviews || [ ] ).forEach( key => 
            this.subviews[ key ].forEach( subviewMeta => {
                this[ subviewMeta.name ] = new subviewMeta.view( { container: this.templateData[ key ] } ) } ) )
    },

    show: function() {
        this.templateData.container.show()
        this.size()
        return this;
    },

    slurpEl: function( el ) {

        var key = el.attr('data-js');

        this.templateData[ key ] = ( this.templateData.hasOwnProperty(key) )
            ? this.templateData[ key ].add( el )
            : el;

        el.removeAttr('data-js');

        if( this.events[ key ] ) this.delegateEvents( key, el )

        return this;
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

module.exports = MyView
