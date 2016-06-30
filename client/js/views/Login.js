module.exports = Object.assign( {}, require('./__proto__'), {

    constructor() {
        if( window.location.pathname === "/admin" ) {
            Object.assign( this.fields[0], {
                label: 'Email or Username',
                error: "Username must be at least 6 characters long.",
                validate: val => val.length >= 6 } )
        }

        require('./__proto__').constructor.call(this)
    },

    events: {
        'registerBtn': { event: 'click', selector: '', method: 'showRegistration' },
        'loginBtn': { event: 'click', selector: '', method: 'login' }
    },

    fields: [ {
        class: 'input-borderless',
        name: 'email',
        placeholder: 'Email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        class: 'input-borderless',
        name: 'password',
        placeholder: 'Password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: val => val.length >= 6
    } ],

    Form: require('./Form'),

    login() { this.formInstance.submitForm( { resource: "auth" } ) },

    onSubmissionResponse( response ) {
        if( Object.keys( response ).length === 0 ) {
            return this.slurpTemplate( { template: this.templates.invalidLoginError, insertion: { $el: this.templateData.container } } )
        }
    
        require('../models/User').set( response )
        this.emit( "loggedIn" )
        this.hide()
    },

    postRender() {
        this.formInstance = Object.create( this.Form, { 
            fields: { value: this.fields }, 
            container: { value: this.templateData.form },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()

        return this
    },

    Register: require('./Register'),

    requiresLogin: false,

    showRegistration() { 
        var form = this.formInstance

        form.templateData.email.val('');
        form.templateData.password.val('');
        if ( form.templateData.invalidLoginError ) form.templateData.invalidLoginError.remove();
        if ( form.templateData.serverError ) form.templateData.serverError.remove();
        
        this.hide().then( () => Object.create( this.Register ).constructor() )

    },

    template: require('./templates/login'),

    templates: {
        invalidLoginError: require('./templates/invalidLoginError')
    }

} )
