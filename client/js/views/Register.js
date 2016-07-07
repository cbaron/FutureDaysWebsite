module.exports = Object.assign( {}, require('./__proto__'), {

    cancel: function() {

        var form = this.formInstance,
            name = form.templateData.name,
            email = form.templateData.email
        
        form.removeError( name )
        name.val('')

        form.removeError( email )
        email.val('')
        
        if ( form.templateData.invalidLoginError ) form.templateData.invalidLoginError.remove()
        if ( form.templateData.serverError ) form.templateData.serverError.remove()

        this.loginInstance[ "registerInstance" ] = this
        this.hide().then( () => this.loginInstance.show() )
    },

    events: {
        'registerBtn': { event: 'click', selector: '', method: 'register' },
        'cancelBtn': { event: 'click', selector: '', method: 'cancel' }
    },

    fields: [ {
        name: 'name',
        type: 'text',
        error: 'Name is a required field.',
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        name: 'email',
        type: 'text',
        error: 'Please enter a valid email address.',
        validate: function( val ) { return this.emailRegex.test(val) }
    } ],

    Form: require('./Form'),

    onSubmissionResponse: function( response ) {

        if ( response.success === false ) {
            return this.slurpTemplate( { template: this.templates.invalidLoginError( response ), insertion: { $el: this.templateData.buttonRow, method: 'before' } } )
        }

        this.user.set( response.result.member )

        this.fields.forEach( field => this.templateData[ field.name ].val('') )

        this.hide().then( () => this.loginInstance.emit( "loggedIn" ) )
        
    },

    postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: this.class },
            fields: { value: this.fields },
            horizontal: { value: this.horizontal }, 
            container: { value: this.templateData.form },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()
        
        return this
    },

    requiresLogin: false,

    register() { this.formInstance.submitForm( { resource: "member" } ) },
    
    requiresLogin: false,

    template: require('./templates/register'),

    templates: {
        invalidLoginError: require('./templates/invalidLoginError')
    }

} )