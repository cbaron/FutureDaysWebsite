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

        Object.keys( this.els ).forEach( key => {
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
            resource: this.resource
        } )
    },

    postRender() {

        this.fields.forEach( field => {
            var $el = this.els[ field.name ]
            $el.on( 'blur', () => {
                var rv = field.validate.call( this, $el.val() )
                if( typeof rv === "boolean" ) return rv ? this.showValid($el) : this.showError( $el, field.error )
                rv.then( () => this.showValid($el) )
                 .catch( () => this.showError( $el, field.error ) )
             } )
            .on( 'focus', () => this.removeError( $el ) )
        } )

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

    submit() {
        return this.validate()
        .then( result => result === false ? Promise.resolve( { invalid: true } ) : this.postForm() )
        .catch( this.somethingWentWrong )
    },

    template: require('./templates/form'),

    templates: {
        fieldError: require('./templates/fieldError')
    },

    validate() {
        var valid = true,
            promises = [ ]
                
        this.fields.forEach( field => {
            var $el = this.els[ field.name ],
                rv = field.validate.call( this, $el.val() )
            if( typeof rv === "boolean" ) {
                if( rv ) { this.showValid($el) } else { this.showError( $el, field.error ); valid = false }
            } else {
                promises.push(
                    rv.then( () => Promise.resolve( this.showValid($el) ) )
                     .catch( () => { this.showError( $el, field.error ); return Promise.resolve( valid = false ) } )
                )
            }
        } )

        return Promise.all( promises ).then( () => valid )
    }

} )
