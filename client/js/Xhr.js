module.exports = Object.create( Object.assign( {}, require('../../lib/MyObject'), {

    Request: {

        constructor( data ) {
            var req = new XMLHttpRequest(),
                resolver

            req.onload = function() {
                console.log( this )
                console.log(this.responseText);
                /* you can get the serialized data through the "submittedData" custom property: */
                console.log(JSON.stringify(this.submittedData));
                resolver()
            }

            if( data.method === "get" ) {
              req.open( data.method, `/${data.resource}?${data.qs}`, true )
              req.send(null)
            } else {
              /* method is POST */
              oAjaxReq.open( data.method, `/${data.resource}`, true)
                req.setRequestHeader("Content-Type", 'text/plain' )
                req.send( data.data )
            }
            
            return new Promise( resolve => resolver = resolve )
        },

        plainEscape( sText ) {
            /* how should I treat a text/plain form encoding? what characters are not allowed? this is what I suppose...: */
            /* "4\3\7 - Einstein said E=mc2" ----> "4\\3\\7\ -\ Einstein\ said\ E\=mc2" */
            return sText.replace(/[\s\=\\]/g, "\\$&");
        },
    },

    _factory( data ) {
        return Object.create( this.Request, { data: { value: data } } ).constructor()
    },

    constructor() {

        if( !XMLHttpRequest.prototype.sendAsBinary ) {
          XMLHttpRequest.prototype.sendAsBinary = function(sData) {
            var nBytes = sData.length, ui8Data = new Uint8Array(nBytes);
            for (var nIdx = 0; nIdx < nBytes; nIdx++) {
              ui8Data[nIdx] = sData.charCodeAt(nIdx) & 0xff;
            }
            this.send(ui8Data);
          };
        }

        return this._factory
    }

} ), { } ).constructor()
