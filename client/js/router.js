module.exports = new (
    require('backbone').Router.extend( {

        Error: require('../../lib/MyError'),

        Format: require('util').format,

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
                    console.log(resource)
                    if( this.views[ resource ] ) return this.views[ resource ].show()
                    this.views[ resource ] =
                        Object.create(
                            require( this.Format( './views/%s', resource.charAt(0).toUpperCase() + resource.slice(1) ) ),
                            { user: { value: this.user }, router: { value: this } }
                        ).constructor()
                } )
               
                this.$(window).scrollTop(0)
            
            } ).fail( this.Error )
            
        },

        routes: {
            '(:resource)': 'handler',
        },
        
        user: require('./models/User'),

    } )
)()
