module.exports = {

    _: require('underscore'),

    Error: require('./MyError'),

    Moment: require('moment'),
    
    constructor() { return this },

    format: require('util').format
}
