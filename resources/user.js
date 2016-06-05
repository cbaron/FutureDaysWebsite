module.exports = Object.assign( { }, require('./__proto__'), {

    chains: {
        DELETE: [ function() { this.notFound() } ],
        GET: [ function() { return this.Validate.apply(this) }, function() { this.respond( { body: this.user } ) } ],
        PATCH: [ function() { this.notFound() } ],
        POST: [ function() { this.notFound() } ]
    },

} )
