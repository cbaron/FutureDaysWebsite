module.exports = new ( require('backbone').Model.extend( {
    defaults: { state: {} },
    url() { return "/user" }
} ) )()
