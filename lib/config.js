var _ = require("underscore");

module.exports = function ( r ) {
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
	// add callback
	
	return config;
	
};
