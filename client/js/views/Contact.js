module.exports = Object.assign( {}, require('./__proto__'), {

    /*fields: [ {
        name: 'name',
        type: 'text'

    }, {        
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

    postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: this.class },
            //horizontal: { value: this.horizontal },
            fields: { value: this.fields }, 
            container: { value: this.templateData.form },
            //onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()
        
        return this
    }*/

} )