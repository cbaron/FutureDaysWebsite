module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('../../lib/MyError'),
        
        User: require('./models/User'),

        Views: require('./.ViewMap'),
        
        Templates: require('./.TemplateMap'),
        
        initialize() {
            return Object.assign( this, {
                views: { },
                header: Object.create( this.Views.Header, { template: { value: this.Templates.header } } ).constructor()
            } )
        },

        goHome() { this.navigate( 'home', { trigger: true } ) },

        handler( resource ) {

            if( !resource ) return this.goHome()

            this.User.fetched.done( () => {

                this.Views.Header
                    .onUser( this.User )
                    .on( 'signout', () => 
                        Promise.all( Object.keys( this.views ).map( name => this.views[ name ].delete() ) )
                        .then( this.goHome() )
                    )
                
                Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
                .then( () => {
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        Object.create(
                            this.Views[ `${resource.charAt(0).toUpperCase() + resource.slice(1)}` ],
                            {
                                insertionEl: this.$('#content'),
                                template: { value: this.Templates[ resource ] },
                                user: { value: this.User }
                            } )
                        .constructor()
                        .on( 'route', route => this.navigate( route, { trigger: true } ) )
                } )
                .catch( this.Error )
               
            } ).fail( this.Error )
            
        },

        routes: { '(*request)': 'handler' }

    } )
)()
