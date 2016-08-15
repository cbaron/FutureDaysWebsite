module.exports = Object.assign( {}, require('./__proto__'), {

    Xhr: require('../Xhr'),

    postRender() {

        this.Xhr( { method: 'GET', resource: `verify/${window.location.pathname.split('/').pop()}` } )
        .then( () => true )
        .catch( this.somethingWentWrong )

        return this
    }
} )
