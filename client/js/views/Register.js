module.exports = Object.assign( {}, require('./__proto__'), {

    cancel: function() {

        var form = this.formInstance,
            name = form.els.name,
            email = form.els.email
        
        form.removeError( name )
        name.val('')

        form.removeError( email )
        email.val('')
        
        if ( form.els.invalidLoginError ) form.els.invalidLoginError.remove()
        if ( form.els.serverError ) form.els.serverError.remove()

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
            return this.slurpTemplate( { template: this.templates.invalidLoginError( response ), insertion: { $el: this.els.buttonRow, method: 'before' } } )
        }

        this.user.set( response.result.member )

        this.fields.forEach( field => this.els[ field.name ].val('') )

        this.hide().then( () => this.loginInstance.emit( "loggedIn" ) )
        
    },

    postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: this.class },
            fields: { value: this.fields },
            horizontal: { value: this.horizontal }, 
            insertion: { value: { $el: this.els.form } },
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
