module.exports = Object.assign( { }, require('./__proto__'), {

    DELETE: [ function() { return this.notFound() } ],

    GET: [ function() { return this.Validate.apply( this ) }, function() { return this.respond( { body: this.user } ) } ],

    PATCH: [ function() { return this.notFound() }, ],

    POST: [ function() { return this.notFound() } ]

} )
