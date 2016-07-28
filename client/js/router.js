module.exports = new (
    require('backbone').Router.extend( {

        Error: require('../../lib/MyError'),
        
        Demo: require('./views/Demo'),

        //Header: require('./views/Header'),
        
        Home: require('./views/Home'),
        
        User: require('./models/User'),
        
        initialize() {

            this.views = { }

            return this
        },

        handler( resource ) {

            if( !resource ) return this.navigate( 'home', { trigger: true } )

            //this.Header.constructor()
                
            this.User.fetched.done( () => {

                if( this.User.id ) this.Header.onUser( this.User )
                
                Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
                .then( () => {
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        Object.create(
                            require( `./views/${resource.charAt(0).toUpperCase() + resource.slice(1)}` ),
                            { user: { value: this.User }, router: { value: this } }
                        ).constructor()
                } )
               
                require('jquery')(window).scrollTop(0)
            
            } ).fail( this.Error )
            
        },

        routes: {
            '(*request)': 'handler'
        },
        

    } )
)()
