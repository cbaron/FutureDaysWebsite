module.exports = new ( require('backbone').Model.extend( {
    defaults: { state: {} },
    initialize() {
        this.fetched = this.fetch()
        return this
    },
    url() { return "/user" }
} ) )()
