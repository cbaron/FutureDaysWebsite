(function(){function page(it
/**/) {
var out='<!DOCTYPE html><html> <head> <link rel="stylesheet" type="text/css" href="/static/css/bundle.css"> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1"> <script src="/static/js/main.js"</script> ';if(it.isDev){out+='<script src="//localhost:9091"></script>';}out+=' <title>';it.titleout+='</title> </head> <body> <div class="container-fluid"> <div class="row" id="content"></div> </div> </body></html>';return out;
}var itself=page, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['page']=itself;}}());