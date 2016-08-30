module.exports = Object.assign( { }, require('./__proto__'), {

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions() { 
        this.fields.forEach( field => {
            var name = field.name.charAt(0).toUpperCase() + field.name.slice(1)
            field[ 'class' ] = this.class
            if( this.horizontal ) field[ 'horizontal' ] = true
            if( field.textarea ) field[ 'textarea' ] = true
            field[ ( this.class === 'form-input' ) ? 'label' : 'placeholder' ] = name

        } )

        return { fields: this.fields } },

    getFormData() {

        Object.keys( this.els, key => {
            if( /INPUT|TEXTAREAD/.test( this.els[ key ].prop("tagName") ) ) this.formData[ key ] = this.els[ key ].val()
        } )

        return this.formData
    },

    fields: [ ],

    onFormFail( error ) {
        console.log( error.stack || error );
        //this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.els.buttonRow, method: 'before' } } )
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

        this.els.container.find('input, textarea')
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
                var result = field.validate.call(this, this.els[ field.name ].val() )                          
                if( result === false ) {
                    valid = false
                    this.showError( this.els[ field.name ], field.error )                    
                }

                resolve()
            } )
        } ) )
        .then( () => valid )
        .catch( e => { console.log( e.stack || e ); return false } )
    }

} )
