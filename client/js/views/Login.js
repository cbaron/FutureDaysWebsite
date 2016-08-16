module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        form: {
            opts: {
                fields: {
                    value: [ {        
                        name: 'email',
                        type: 'text',
                        error: 'Please enter a valid email address.',
                        validate: function( val ) { return this.emailRegex.test(val) }
                    }, {
                        name: 'password',
                        type: 'password',
                        error: 'Passwords must be at least 6 characters long.',
                        validate: val => val.length >= 6
                    } ]
                },
                resource: { value: 'auth' }
            }
        }
    },

    events: {
        registerBtn: 'click',
        loginBtn: 'click'
    },

    login() { this.formInstance.submitForm( { resource: "auth" } ) },

    onSubmissionResponse( response ) {
        if( Object.keys( response ).length === 0 ) {
            //return this.slurpTemplate( { template: this.templates.invalidLoginError, insertion: { $el: this.els.container } } )
        }
    
        require('../models/User').set( response )
        this.emit( "loggedIn" )
        this.hide()
    },

    onLoginBtnClick() {
        this.views.form.submit()
    },

    onRegisterBtnClick() {

        this.views.form.clear()        

        this.hide()
        .then( () => {
            if( this.views.register ) return this.views.register.show()
            this.views.register =
                this.factory.create( 'register', { insertion: { value: { $el: this.$('#content') } } } )
                .on( 'cancelled', () => this.show() )
        } )
        .catch( this.somethingWentWrong )
    }

} )
