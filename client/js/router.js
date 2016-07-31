module.exports = new (
    require('backbone').Router.extend( {

        Error: require('../../lib/MyError'),
        
        //Header: require('./views/Header'),
        
        User: require('./models/User'),

        Views: require('./.ViewMap'),
        
        initialize() {

            this.views = { }

            return this
        },

        handler( resource ) {

            if( !resource ) return this.navigate( 'home', { trigger: true } )

            //this.Header.constructor()
                
            this.User.fetched.done( () => {

                //this.Header.onUser( this.User )
                
                Promise.all( Object.keys( this.views ).map( view => this.views[ view ].hide() ) )
                .then( () => {
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        Object.create(
                            this.Views[ `${resource.charAt(0).toUpperCase() + resource.slice(1)}` ],
                            { user: { value: this.User } } )
                        .constructor()
                        .on( 'route', route => this.navigate( route, { trigger: true } ) )
                } )
                .catch( this.Error )
               
            } ).fail( this.Error )
            
        },

        routes: { '(*request)': 'handler' }

    } )
)()
