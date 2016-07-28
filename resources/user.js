module.exports = Object.assign( { }, require('./__proto__'), {

    DELETE: [ this.notFound ],

    GET() { return [ this.Validate.apply.bind( this.Validate ), function( resource ) { resource.respond( { body: resource.user } ) } ] },

    PATCH: [ function() { this.notFound() } ],

    POST: [ function() { this.notFound() } ]

} )
