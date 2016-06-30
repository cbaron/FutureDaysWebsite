module.exports = Object.assign( {}, require('./__proto__'), {

    cancel: function() {
        //this.hide().then( () => this.loginInstance.show() )
        this.delete()
        this.loginInstance.show()
    },

    events: {
        'registerBtn': { event: 'click', selector: '', method: 'register' },
        'cancelBtn': { event: 'click', selector: '', method: 'cancel' }
    },

    fields: [ {
        class: 'input-borderless',
        name: 'name',
        placeholder: 'Name',
        type: 'text',
        error: 'Name is a required field.',
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        class: 'input-borderless',
        name: 'email',
        placeholder: 'Email',
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
            fields: { value: this.fields }, 
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