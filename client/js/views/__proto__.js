module.exports = Object.assign( { }, require('../../../lib/MyObject'), require('events').EventEmitter.prototype, {

    Model: require('../models/__proto__'),

    NumberFormat: new Intl.NumberFormat( 'en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    } ),

    OptimizedResize: require('./lib/OptimizedResize'),

    Xhr: require('../Xhr'),

    bindEvent( key, event, el ) {
        var els = el ? [ el ] : Array.isArray( this.els[ key ] ) ? this.els[ key ] : [ this.els[ key ] ]
        els.forEach( el => el.addEventListener( event || 'click', e => this[ `on${this.capitalizeFirstLetter(key)}${this.capitalizeFirstLetter(event)}` ]( e ) ) )
    },

    capitalizeFirstLetter: string => string.charAt(0).toUpperCase() + string.slice(1),

    constructor() {

        if( this.requiresLogin && (!this.user.data || !this.user.data.id ) ) return this.handleLogin()

        return this.initialize().render()
    },

    delegateEvents( key, el ) {
        var type = typeof this.events[key]

        if( type === "string" ) { this.bindEvent( key, this.events[key], el ) }
        else if( Array.isArray( this.events[key] ) ) {
            this.events[ key ].forEach( eventObj => this.bindEvent( key, eventObj.event ) )
        } else {
            this.bindEvent( key, this.events[key].event )
        }
    },

    delete() {
        return this.hide()
        .then( () => {
            this.els.container.parentNode.removeChild( this.els.container )
            return Promise.resolve( this.emit('deleted') )
        } )
    },

    events: {},

    getData() {
        if( !this.model ) this.model = Object.create( this.Model, { resource: { value: this.name } } )

        return this.model.get()
    },

    getTemplateOptions() {
        return Object.assign(
            {},
            (this.model) ? this.model.data : {} ,
            { user: (this.user) ? this.user.data : {} },
            { opts: (this.templateOpts) ? this.templateOpts : {} }
        )
    },

    handleLogin() {
        this.factory.create( 'login', { insertion: { value: { el: document.querySelector('#content') } } } )
            .once( "loggedIn", () => this.onLogin() )

        return this
    },

    hide() {
        if( !document.body.contains(this.els.container) || this.isHidden() ) {
            return Promise.resolve()
        } else if( this.els.container.classList.contains('hide') ) {
            return new Promise( resolve => this.once( 'hidden', resolve ) )
        } else {
            return new Promise( resolve => {
                this.onHiddenProxy = e => this.onHidden(resolve)
                this.els.container.addEventListener( 'transitionend', this.onHiddenProxy )
                this.els.container.classList.add('hide')
            } )
        }
    },

    htmlToFragment( str ) {
        let range = document.createRange();
        // make the parent of the first div in the document becomes the context node
        range.selectNode(document.getElementsByTagName("div").item(0))
        return range.createContextualFragment( str )
    },

    initialize() {
        return Object.assign( this, { els: { }, slurp: { attr: 'data-js', view: 'data-view' }, views: { } } )
    },
    
    isHidden() { return this.els.container.classList.contains('hidden') },

    onHidden( resolve ) {
        this.els.container.removeEventListener( 'transitionend', this.onHiddenProxy )
        this.els.container.classList.add('hidden')
        resolve( this.emit('hidden') )
    },

    onLogin() {
        this.initialize().render()
    },

    onNavigation( path ) {
        return this.show()
    },

    onShown( resolve ) {
        this.els.container.removeEventListener( 'transitionend', this.onShownProxy )
        if( this.size ) this.size()
        resolve( this.emit('shown') )
    },

    showNoAccess() {
        alert("No privileges, son")
        return this
    },

    postRender() { return this },

    render() {
        this.slurpTemplate( { template: this.template( this.getTemplateOptions() ), insertion: this.insertion, isView: true } )

        this.renderSubviews()

        if( this.size ) { this.size(); this.OptimizedResize.add( this.size.bind(this) ) }

        return this.postRender()
    },

    renderSubviews() {
        Object.keys( this.viewEls || { } ).forEach( key => {
            let opts = { }
            if( this.Views && this.Views[ key ] && this.Views[ key ].opts ) {
                opts =
                    typeof this.Views[ key ].opts === "object"
                        ? this.Views[ key ].opts
                        : Reflect.apply( this.Views[ key ].opts, this, [ ] )
            }
            this.views[ key ] = this.factory.create( key, Object.assign( { insertion: { value: { el: this.viewEls[ key ], method: 'insertBefore' } } }, { opts: { value: opts  } } ) )
            this.viewEls[ key ].remove()
            this.viewEls[ key ] = undefined
        } )

        return this
    },

    requiresLogin: false,

    show() {
        if( this.els.container.classList.contains( 'hidden' ) ) {
            this.els.container.classList.remove( 'hidden' )
            
            return new Promise( resolve => {
                setTimeout( () => {
                    this.onShownProxy = e => this.onShown(resolve)
                    this.els.container.addEventListener( 'transitionend', this.onShownProxy )
                    this.els.container.classList.remove( 'hide' )
                }, 10 ) 
            } )
        } else if( this.els.container.classList.contains( 'hide' ) ) {
            this.els.container.classList.remove( 'hide' )
            this.els.container.removeEventListener( 'transitionend', this.onHiddenProxy )
            
            return new Promise( resolve => {
                setTimeout( () => {
                    this.onShownProxy = e => this.onShown(resolve)
                    this.els.container.addEventListener( 'transitionend', this.onShownProxy )
                    this.els.container.classList.remove( 'hide' )
                }, 10 ) 
            } )
        } else {
            return new Promise( resolve => this.once( 'shown', resolve ) )
        }
    },

    slurpEl( el ) {
        var key = el.getAttribute( this.slurp.attr ) || 'container'

        if( key === 'container' ) el.classList.add( this.name )

        this.els[ key ] = Array.isArray( this.els[ key ] )
            ? this.els[ key ].push( el )
            : ( this.els[ key ] !== undefined )
                ? [ this.els[ key ], el ]
                : el

        el.removeAttribute(this.slurp.attr)

        if( this.events[ key ] ) this.delegateEvents( key, el )
    },

    slurpTemplate( options ) {
        var fragment = this.htmlToFragment( options.template ),
            selector = `[${this.slurp.attr}]`,
            viewSelector = `[${this.slurp.view}]`,
            firstEl = fragment.querySelector('*')

        if( options.isView || firstEl.getAttribute( this.slurp.attr ) ) this.slurpEl( firstEl )
        fragment.querySelectorAll( `${selector}, ${viewSelector}` ).forEach( el => {
            if( el.hasAttribute( this.slurp.attr ) ) { this.slurpEl( el ) }
            else if( el.hasAttribute( this.slurp.view ) ) {
                if( ! this.viewEls ) this.viewEls = { }
                this.viewEls[ el.getAttribute(this.slurp.view) ] = el
            }
        } )
          
        options.insertion.method === 'insertBefore'
            ? options.insertion.el.parentNode.insertBefore( fragment, options.insertion.el )
            : options.insertion.method === 'after'
                ? options.insertion.el.parentNode.insertBefore( fragment, options.insertion.el.nextSibling )
                : options.insertion.el[ options.insertion.method || 'appendChild' ]( fragment )

        return this
    }

} )
