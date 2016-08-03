#!/usr/bin/env node

var fs = require('fs'),
    server

require('node-env-file')( `${__dirname}/../.env` )

server = require('livereload').createServer( {
    exclusions: [ '.js' ],
    exts: [ 'gz' ],
    https: { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) },
    originalPath: `https://${process.env.DOMAIN}.com`
} )

server.watch( [ `${__dirname}/../static/css`, `${__dirname}/../static/js/bundle.js.gz`, `${__dirname}/../static/js/vendor.js.gz` ] )
