/**
 * Substitute GET /foo.json with GET /foo Accept: application/json;q=1
 */

module.exports = function() {

  var extname = require('path').extname;
  var Mime = require('mime');
  var defaultType = Mime.default_type;

  return function(req, res, next) {
    var ext = extname(req.path); // NB: req._parsedUrl is created
    var accept = Mime.lookup(ext);
    if (accept != defaultType) {
      req.headers.accept = accept + ';q=1, ' + (req.headers.accept || '');
      // NB: req.path uses req._parsedUrl.pathname
      req._parsedUrl.pathname = req.path.slice(0, -ext.length);
    }
    next();
  };

};
