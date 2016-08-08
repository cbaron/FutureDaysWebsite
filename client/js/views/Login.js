module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        form: { opts:
    },

    events: {
        registerBtn: 'click',
        loginBtn: 'click'
    },

    fields: [ {        
        name: 'email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        name: 'password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: val => val.length >= 6
    } ],

    Form: require('./Form'),

    login() { this.formInstance.submitForm( { resource: "auth" } ) },

    onSubmissionResponse( response ) {
        if( Object.keys( response ).length === 0 ) {
            return this.slurpTemplate( { template: this.templates.invalidLoginError, insertion: { $el: this.els.container } } )
        }
    
        require('../models/User').set( response )
        this.emit( "loggedIn" )
        this.hide()
    },

    postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: this.class },
            //horizontal: { value: this.horizontal },
            fields: { value: this.fields }, 
            insertion: { value: { $el: this.els.form } },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()
        
        return this
    },

    Register: require('./Register'),

    requiresLogin: false,

    onRegisterBtnClick() {

        var form = this.formInstance,
            email = form.els.email,
            password = form.els.password
        
        form.removeError( email )
        email.val('')

        form.removeError( password )
        password.val('')
        
        if ( form.els.invalidLoginError ) form.els.invalidLoginError.remove()
        if ( form.els.serverError ) form.els.serverError.remove()
        
        this.hide().then( () => ( this.registerInstance ) ? this.registerInstance.show()
            : Object.create( this.Register, {
                loginInstance: { value: this },
                class: { value: 'input-flat' } 
            } ).constructor() )

    },

    template: require('./templates/login'),

    templates: {
        invalidLoginError: require('./templates/invalidLoginError')
    }

} )
