module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('../../lib/MyError'),
        
        User: require('./models/User'),

        ViewFactory: require('./factory/View'),

        initialize() {

            this.contentContainer = this.$('#content')

            return Object.assign( this, {
                views: { },
                header: this.ViewFactory.create( 'header', { insertion: { value: { $el: this.contentContainer, method: 'before' } } } )
            } )
        },

        goHome() { this.navigate( 'home', { trigger: true } ) },

        handler( resource ) {

            if( !resource ) return this.goHome()

            this.User.fetched.done( () => {

                this.header.onUser()
                    .on( 'signout', () => 
                        Promise.all( Object.keys( this.views ).map( name => this.views[ name ].delete() ) )
                        .then( this.goHome() )
                    )
                
                Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
                .then( () => {
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        this.ViewFactory.create( resource, { insertion: { value: { $el: this.contentContainer } } } )
                            .on( 'route', route => this.navigate( route, { trigger: true } ) )
                } )
                .catch( this.Error )
               
            } ).fail( this.Error )
            
        },

        routes: { '(*request)': 'handler' }

    } )
)()
