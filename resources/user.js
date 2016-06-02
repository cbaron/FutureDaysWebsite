module.exports = Object.assign( { }, require('./__proto__'), {

    chains: {
        DELETE: [ function() { this.notFound() } ],
        GET: [ function() { return this.validate.GET.call(this) }, function() { this.respond( { body: this.user } ) } ],
        PATCH: [ function() { this.notFound() } ],
        POST: [ function() { this.notFound() } ]
    },

    GET() { return this.validate.GET.call(this).then( () => this.respond( { body: this.user } ) ) }

} )
