module.exports = {

    _: require('underscore'),

    Error: require('./MyError'),

    Moment: require('moment'),

    constructor(data) { return Object.assign( this,data ) },

    format: require('util').format
}
