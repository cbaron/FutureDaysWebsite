var fs = require('fs')

require('node-env-file')( __dirname + '/.env' );

require('https')
    .createServer( { key: fs.readFileSync( process.env.SSLKEY ), cert: fs.readFileSync( process.env.SSLCERT ) }, require('./router') )
    .listen( process.env.PORT )
