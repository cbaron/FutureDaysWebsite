module.exports = new (
    require('backbone').Router.extend( {

        Error: require('../../lib/MyError'),

        Header: require('./views/Header'),
        
        initialize() {

            this.userPromise = this.user.fetch()

            this.views = { }

            return this
        },

        handler( resource ) {

            if( !resource ) return this.navigate( 'home', { trigger: true } )

            this.Header.constructor()
             
            this.userPromise.done( () => {

                if( this.user.id ) this.header.onUser( this.user )
                
                Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
                .then( () => {
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        Object.create(
                            require( `client/js/views/${resource.charAt(0).toUpperCase() + resource.slice(1)}` ),
                            { user: { value: this.user }, router: { value: this } }
                        ).constructor()
                } )
               
                require('jquery')(window).scrollTop(0)
            
            } ).fail( this.Error )
            
        },

        routes: {
            '(:resource)': 'handler',
        },
        
        user: require('./models/User'),

    } )
)()
