module.exports = Object.assign( {}, require('./__proto__'), {

    fields: [ {
        name: 'from',
        type: 'email',
        placeholder: 'From',
        error: 'Please enter a valid email address.',
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {        
        name: 'subject',
        type: 'text',
        placeholder: 'Subject',
        error: 'Please enter a subject.',
        validate: val => val.length > 0        
    }, {
        name: 'message',
        textarea: true,
        placeholder: "Message",
        rows: '10',
        error: "Please type out your message.",
        validate: val => val.length > 0
    } ],

    Form: require('./Form'),

    onSubmissionResponse() { return },

    postRender() {
        this.formInstance = Object.create( this.Form, {
            class: { value: 'input-borderless' },
            fields: { value: this.fields }, 
            insertion: { value: { $el: this.els.form } },
            onSubmissionResponse: { value: this.onSubmissionResponse }
        } ).constructor()
        
        return this
    }

} )