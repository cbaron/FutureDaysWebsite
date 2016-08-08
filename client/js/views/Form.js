module.exports = Object.assign( { }, require('./__proto__'), {

    Xhr: require('../Xhr'),

    clear() {
        this.fields.forEach( field => {
            this.removeError( this.els[ field.name ] )
            this.els[ field.name ].val('')
        } )

        if( this.els.error ) { this.els.error.remove(); this.else.error = undefined }
    },

    emailRegex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,

    getTemplateOptions() { 
        return { fields: this.fields }
    },

    getFormData() {
        var data = { }

        Object.keys( this.els, key => {
            if( /INPUT|TEXTAREA|SELECT/.test( this.els[ key ].prop("tagName") ) ) data[ key ] = this.els[ key ].val()
        } )

        return data
    },

    fields: [ ],

    onFormFail( error ) {
        console.log( error.stack || error );
        //this.slurpTemplate( { template: this.templates.serverError( error ), insertion: { $el: this.els.buttonRow, method: 'before' } } )
    },
    
    postForm() {
        return this.Xhr( {
            data: JSON.stringify( this.getFormData() ),
            method: 'post',
            resource: 'person'
        } )
    },

    postRender() {

        var self = this

        this.els.container.find('input')
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

    //undelete disabled member -- error submitted modal
    //after notification is sent to ios, message does not show up in application until they relog --
    //broadcast image messages ( only some people getting message )
    //update prod
    //update rackspace

    submit() {
        return this.validate()
        .then( result => result === false ? Promise.resolve( { invalid: true } ) : this.postForm() )
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
