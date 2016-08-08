module.exports = Object.create( {

    create( name, opts ) {
        return Object.create(
            this.Views[ name.charAt(0).toUpperCase() + name.slice(1) ],
            Object.assign( { template: { value: this.Templates[ name ] }, user: { value: this.User }, factory: { value: this }, name: { value: name } }, opts )
        ).constructor()
    },

}, {
    Templates: { value: require('../.TemplateMap') },
    User: { value: require('../models/User' ) },
    Views: { value: require('../.ViewMap') }
} )
