module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        form: {
            opts: {
                fields: {
                    value: [ {
                        name: 'name',
                        type: 'text',
                        error: 'Name is a required field.',
                        validate: function( val ) { return val.trim().length > 0 }
                    }, {
                        name: 'email',
                        type: 'text',
                        error: 'Please enter a valid email address.',
                        validate: function( val ) { return this.emailRegex.test(val) }
                    }, {
                        name: 'password',
                        type: 'text',
                        error: 'Passwords must be at least 6 characters long.',
                        validate: function( val ) { return val.trim().length > 5 }
                    }, {
                        label: 'Repeat Password',
                        name: 'repeatPassword',
                        type: 'text',
                        error: 'Passwords must match.',
                        validate: function( val ) { return this.els.password.val() === val }
                    } ]
                },

                resource: { value: 'person' }
            }
        }
    },

    onCancelBtnClick() {

        this.views.form.clear()

        this.hide().then( () => this.emit('cancelled') )
    },

    events: {
        cancelBtn: 'click',
        registerBtn: 'click'
    },

    onRegisterBtnClick() {
        this.views.form.submit()
        .then( response => {
            if( response.invalid ) return
            //show static, "success" modal telling them they can login once they have verified their email
            console.log('Great Job')
        } )
        .catch( this.somethingWentWrong )
    }
    
} )
