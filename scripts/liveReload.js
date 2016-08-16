#!/usr/bin/env node

var fs = require('fs'),
    server

require('node-env-file')( `${__dirname}/../.env` )

server = require('../lib/livereload').createServer( {
    exts: [ 'gz' ],
    ignoreExts: [ 'js', 'css' ],
    https: { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) },
    originalPath: `https://${process.env.DOMAIN}.com`
} )

server.watch( `${__dirname}/../static` )
