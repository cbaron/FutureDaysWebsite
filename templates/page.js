module.exports = ( options ) => `

<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="/static/css/main.css">

        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <script src="/static/dist/js/debug.js"></script>
        
        <title>${options.title}</title>
    </head>

    <body>
        <div class="container-fluid">
           <div class="row" id="content"></div>
        </div>
    </body>

</html>
`