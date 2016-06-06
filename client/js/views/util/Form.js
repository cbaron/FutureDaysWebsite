var MyView = require('../MyView'),
    Form = function() { return MyView.apply( this, arguments ) }

Object.assign( Form.prototype, MyView.prototype, {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    fields: [ ],

    onFormFail: function( error ) {
        console.log( error.stack || error );
        this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.templateData.buttonRow, method: 'before' } } )
    },

    onSubmissionResponse: function() { },
    
    postForm( data ) {
        return this.Q(
            this.$.ajax( {
                data: JSON.stringify( data.values ) || JSON.stringify( this.getFormData() ),
                headers: { token: ( this.user ) ? this.user.get('token') : '' },
                type: "POST",
                url: this.util.format( "/%s", data.resource )
            } )
        )
    },

    removeErrors: function( e ) {

        var input = this.$( e.target );
        input.parent().removeClass('has-error');
        input.next().remove();

    },

    submitForm: function( resource ) {
        
        if ( this.validateForm() === false ) return
        this.postForm( resource )
          .then( this.onSubmissionResponse.bind(this) )
          .fail( this.onFormFail.bind(this) )
          .done()
    
    },
    
    templates: {
        //fieldError: require('../../templates/fieldError')( require('handlebars') ),
        //invalidLoginError: require('../../templates/invalidLoginError')( require('handlebars') ),
        //serverError: require('../../templates/serverError')(require('handlebars') )
    },

    validateForm: function() {
        var valid = true
        
        if ( this.templateData.invalidLoginError ) this.templateData.invalidLoginError.remove();
        if ( this.templateData.serverError ) this.templateData.serverError.remove();

        this.fields.forEach( function( field ) {
          
          this.templateData[ field.name ].parent().removeClass('has-error');
          this.templateData[ field.name ].next().remove();

          if ( field.validate.call( this, this.templateData[ field.name ].val() ) === false ) {
            valid = false

            this.templateData[ field.name ].parent().addClass('has-error');
            this.slurpTemplate( { template: this.templates.fieldError( field ), insertion: { $el: this.templateData[ field.name ].parent(), method: 'append' } } )
          }

        }, this )
        
        return valid

    }

} )

module.exports = Form
