module.exports = Object.assign( {}, require('./__proto__'), {

    fields: [ {
        class: "form-input",
        name: "email",
        label: 'Email',
        type: 'text',
        error: "Please enter a valid email address.",
        validate: function( val ) { return this.emailRegex.test(val) }
    }, {
        class: "form-input",
        horizontal: true,
        name: "password",
        label: 'Password',
        type: 'password',
        error: "Passwords must be at least 6 characters long.",
        validate: val => val.length >= 6
    }, {
        class: "input-borderless",
        name: "address",
        type: 'text',
        placeholder: "Street Address",
        error: "Required field.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        class: "input-flat",
        name: "city",
        type: 'text',
        placeholder: "City",
        error: "Required field.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    }, {
        class: "input-borderless",
        select: true,
        name: "fave",
        label: "Fave Can Album",
        options: [ "Monster Movie", "Soundtracks", "Tago Mago", "Ege Bamyasi", "Future Days" ],
        error: "Please choose an option.",
        validate: function( val ) { return this.$.trim(val) !== '' }
    } ],

    Form: require('./Form'),
    List: require('./List'),

    postRender() {

        this.listInstance = Object.create( this.List, { container: { value: this.templateData.list } } ).constructor()
        this.formInstance = Object.create( this.Form, { 
            fields: { value: this.fields }, 
            container: { value: this.templateData.form }
        } ).constructor()

        this.templateData.submitBtn.on( 'click', () => this.formInstance.submitForm( { resource: '' } ) )

        return this
    },

	template: require('./templates/demo')

} )
