var Handlebars = require("node_modules/.bin/handlebars");  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['page.hbs'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<!DOCTYPE html>\n<html>\n    <head>\n        <link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bundle.css\">\n\n        <meta charset=\"UTF-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n\n        <script src=\"/static/js/main.js\"</script>\n\n        <title>"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</title>\n    </head>\n\n    <body>\n        <div class=\"container-fluid\">\n           <div class=\"row\" id=\"content\"></div>\n        </div>\n    </body>\n\n</html>\n";
},"useData":true});
