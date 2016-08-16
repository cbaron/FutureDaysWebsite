module.exports = {

    Error: require('./MyError'),

    Moment: require('moment'),

    P: ( fun, args=[ ], thisArg=this ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg, args.concat( ( e, ...args ) => e ? reject(e) : resolve(args) ) ) ),
    
    constructor() { return this }
}
