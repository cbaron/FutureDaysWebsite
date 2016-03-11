module.exports = new (
    require('backbone').Router.extend( {

        $: require('jquery'),

        Error: require('../../lib/MyError'),

        initialize: function() {
            this.user = require('./models/User');

            //this.userPromise = new Promise( ( resolve, reject ) => this.user.fetch().done( resolve ).fail( reject ) )

            this.views = { }

            return this;
        },

        handler( resource ) {

            /*
            this.header = ( resource === 'admin' ) ? require('./views/AdminHeader') : require('./views/Header')
            this.footer = require('./views/Footer')
            this.footer[ ( resource === 'admin' ) ? 'hide' : 'show' ]()
            */

            if( !resource ) return this.navigate( 'home', { trigger: true } )
         
            /* 
            this.userPromise.then( () => {

                if( this.user.id ) this.header.onUser( this.user )
               
                //promise.all 
                Object.keys( this.views ).forEach( view => this.views[ view ].hide() )

                if( this.views[ resource ] ) this.views[ resource ].show()
                else this.views[ resource ] = new ( this.resources[ resource ].view )( this.resources[ resource ].options )
                
                if( this.header.$('.header-title').css( 'display' ) === 'none' ) this.header.toggleLogo()
                this.header.$('.navbar-collapse').removeClass( 'in' )
                this.$(window).scrollTop(0)
                this.footer.size()

            } ).catch( err => new this.Error(err) )
            */
        },
        
        routes: {
            '': 'handler',
            ':resource': 'handler',
        }

    } )
)()
