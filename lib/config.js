var _ = require("underscore");

module.exports = function ( r, options ) {
	// fallbacks
	options = options || {};
	// add defaults?

	var config = _.extend({}, r.config);
	// add deps
	//for( var i in r.deps ){
		//console.log( r.deps );
		//config.deps = r.deps;
	//}

	// force cache
	if( !r.options.cache ){
		config.urlArgs = "t=" +  (new Date()).getTime();
	}
	// output
	return ( options.string ) ? require('jsonfn').JSONfn.stringify( config ) : config;

};
