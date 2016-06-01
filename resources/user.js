module.exports = Object.assign( { }, require('./__proto__'), {

    chains: {
        DELETE: [ this.respond( { code: 404 } ) ],
        GET: [ this.validate.GET, () => this.respond( { body: this.user } ) ],
        PATCH: [ this.respond( { code: 404 } ) ],
        POST: [ this.respond( { code: 404 } ) ]
    },

    createChain( method ) {
        if( ! this.chains[ method ] ) return this.getDefaultChain()
        this.chains[ method ].forEach( fun => this.callChain = this.callChain.then( fun.bind(this) ) )
        return this
    },

    GET() { return this.validate.GET.call(this).then( () => this.respond( { body: this.user } ) ) }

} )
