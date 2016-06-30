module.exports = Object.assign( { }, require('./__proto__'), {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions() { return { fields: this.fields } },

    fields: [ ],

    onFormFail( error ) {
        console.log( error.stack || error );
        //this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.templateData.buttonRow, method: 'before' } } )
    },

    onSubmissionResponse() { },

    postForm( data ) {
        
        return new Promise( ( resolve, reject ) => {
            this.$.ajax( {
                data: JSON.stringify( data.values ) || JSON.stringify( this.getFormData() ),
                headers: { token: ( this.user ) ? this.user.get('token') : '' },
                type: "POST",
                url: `/${ data.resource }`
            } )
        } )
    },

    postRender() {

        var self = this

        this.container.find('input')
        .on( 'blur', function() {
            var $el = self.$(this),
                field = self._( self.fields ).find( function( field ) { return field.name === $el.attr('id') } )
                  
            return new Promise( ( resolve, reject ) => resolve( field.validate.call( self, $el.val() ) ) )
            .then( valid => {
                if( valid ) { self.showValid( $el ) }
                else { self.showError( $el, field.error ) }
            } )
        } )
        .on( 'focus', function() { self.removeError( self.$(this) ) } )

        return this
    },

    removeError( $el ) {
        $el.parent().removeClass('error valid')
        $el.siblings('.feedback').remove()
    },

    showError( $el, error ) {

        var formGroup = $el.parent()

        if( formGroup.hasClass( 'error' ) ) return

        formGroup.removeClass('valid').addClass('error').append( this.templates.fieldError( { error: error } ) )
    },

    showValid( $el ) {
        $el.parent().removeClass('error').addClass('valid')
        $el.siblings('.feedback').remove()
    },

    submitForm( resource ) {
        this.validate().then( result => {
            if( result === false ) return
            this.postForm( resource )
            .then( () => this.onSubmissionResponse() )
            .catch( e => this.onFormFail( e ) )
        } )    
    },

    template: require('./templates/form'),

    templates: {
        fieldError: require('./templates/fieldError')
    },

    validate() {
        var valid = true
        
        return Promise.all( this.fields.map( field => {
            return new Promise( ( resolve, reject ) => {
                var result = field.validate.call(this, this.templateData[ field.name ].val() )                          
                if( result === false ) {
                    valid = false
                    this.showError( this.templateData[ field.name ], field.error )                    
                }

                resolve()
            } )
        } ) )
        .then( () => valid )
        .catch( e => { console.log( e.stack || e ); return false } )
    }

} )
