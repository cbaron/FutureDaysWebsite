module.exports = Object.create( Object.assign( {}, require('./__proto__'), {

    events: {
        signoutBtn: { method: 'signout' }
    },

    getTemplateOptions() { return { logo: '/static/img/logo.gif' } },

    hide: function() {

        return this.Q.Promise( function( resolve, reject ) {
            this.templateData.container.hide( 10, () => {
                this.hidden = true
                this.size()
                resolve();
            } );

        }.bind(this) );
    },

    insertionMethod: 'before',

    onUser: function( user ) {
        this.user = user
        this.templateData.name.text( this.user.get('name') )
        this.templateData.userPanel.removeClass('hide')
    },
    
    signout: function() {

        document.cookie = 'patchworkjwt=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        this.user.clear()

        this.templateData.name.text('')
        this.templateData.userPanel.addClass('hide')

        Object.keys( this.router.views ).forEach( name => {
            this.router.views[ name ].delete()
            delete this.router.views[name] 
        } )

        this.delete()
        this.router.navigate( "/", { trigger: true } )
    },

    template: require('./templates/header')

} ) )
