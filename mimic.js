/**
 * Substitute GET /foo.json with GET /foo Accept: application/json;q=1
 */

module.exports = function() {

  var extname = require('path').extname;
  var Mime = require('mime');
  var defaultType = Mime.default_type;

  return function(req, res, next) {
    var acceptParameter = req.param('_accept');
    var contentTypes, allowedTypes = [];

    if (acceptParameter) {
        contentTypes = acceptParameter.split(';');
        for (var i in contentTypes) {
            if (Mime.extension(contentTypes[i])) {
                allowedTypes.push(contentTypes[i]);
            }
        }
        req.headers.accept = allowedTypes.join(';');
    } else {
        var ext = extname(req.path);
        var accept = Mime.lookup(ext);
        if (accept != defaultType) {
          req.headers.accept = accept + ';q=1, ' + (req.headers.accept || '');
          req._parsedUrl.pathname = req.path.slice(0, -ext.length);
        }
    }
    next();
  };

};
